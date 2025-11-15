import Redis from 'ioredis';

let redis: Redis | null = null;
let redisAvailable = false;
let connectionAttempts = 0;

const DEBUG = process.env.NODE_ENV === 'development' || process.env.REDIS_DEBUG === 'true';

function debug(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[Redis-DEBUG] ${message}`, data || '');
  }
}

/**
 * Get Redis client instance
 * Lazy initialization with connection pooling
 */
export function getRedis(): Redis | null {
  // Support multiple Redis URL sources (in priority order):
  // 1. REDIS_URL (manual configuration / Upstash integration)
  // 2. KV_URL (old Vercel KV)
  // 3. UPSTASH_REDIS_URL (Upstash direct)
  // 4. rawgle_REDIS_URL (legacy integration)
  const redisUrl = process.env.REDIS_URL ||
                   process.env.KV_URL ||
                   process.env.UPSTASH_REDIS_URL ||
                   process.env.rawgle_REDIS_URL;

  if (!redisUrl) {
    if (connectionAttempts === 0) {
      console.warn('[Redis] No Redis URL configured, data persistence disabled');
      debug('Environment variables:', {
        NODE_ENV: process.env.NODE_ENV,
        REDIS_URL: process.env.REDIS_URL ? 'SET' : 'NOT SET',
        KV_URL: process.env.KV_URL ? 'SET' : 'NOT SET',
        UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL ? 'SET' : 'NOT SET',
        rawgle_REDIS_URL: process.env.rawgle_REDIS_URL ? 'SET' : 'NOT SET'
      });
    }
    connectionAttempts++;
    return null;
  }

  if (redis === null) {
    try {
      connectionAttempts++;
      debug(`Connection attempt #${connectionAttempts}`);

      // Determine which env var is being used
      let source = 'REDIS_URL (manual/Upstash)';
      if (redisUrl === process.env.KV_URL) source = 'KV_URL (old Vercel KV)';
      else if (redisUrl === process.env.UPSTASH_REDIS_URL) source = 'UPSTASH_REDIS_URL';
      else if (redisUrl === process.env.rawgle_REDIS_URL) source = 'rawgle_REDIS_URL (legacy)';

      debug('Using Redis URL from:', source);
      debug('REDIS_URL format:', redisUrl.replace(/:[^:@]+@/, ':***@')); // Hide password in logs

      redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.error('[Redis] Max retries reached, giving up');
            return null;
          }
          const delay = Math.min(times * 50, 2000);
          debug(`Retry attempt ${times}, delay: ${delay}ms`);
          return delay;
        },
        reconnectOnError: (err) => {
          debug('Reconnect on error:', err.message);
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            // Reconnect on READONLY errors
            return true;
          }
          return false;
        },
      });

      redis.on('connect', () => {
        console.log('[Redis] Connected successfully');
        debug('Connection established');
        redisAvailable = true;
      });

      redis.on('error', (err) => {
        console.error('[Redis] Connection error:', err.message);
        debug('Error details:', err);
        redisAvailable = false;
      });

      redis.on('ready', () => {
        console.log('[Redis] Ready to accept commands');
        debug('Ready state confirmed');
        redisAvailable = true;
      });

      redis.on('close', () => {
        debug('Connection closed');
        redisAvailable = false;
      });

      redis.on('reconnecting', (delay) => {
        debug(`Reconnecting in ${delay}ms`);
      });

    } catch (error) {
      console.error('[Redis] Failed to initialize:', error);
      debug('Initialization error details:', error);
      redis = null;
      redisAvailable = false;
    }
  }

  return redis;
}

/**
 * Check if Redis is available and connected
 */
export function isRedisAvailable(): boolean {
  return redisAvailable && redis !== null;
}

/**
 * Close Redis connection (for cleanup)
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    redisAvailable = false;
  }
}
