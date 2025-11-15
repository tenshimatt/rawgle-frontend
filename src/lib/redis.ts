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
  if (!process.env.REDIS_URL) {
    if (connectionAttempts === 0) {
      console.warn('[Redis] REDIS_URL not configured, data persistence disabled');
      debug('Environment variables:', {
        NODE_ENV: process.env.NODE_ENV,
        REDIS_URL: 'NOT SET'
      });
    }
    connectionAttempts++;
    return null;
  }

  if (redis === null) {
    try {
      connectionAttempts++;
      debug(`Connection attempt #${connectionAttempts}`);
      debug('REDIS_URL format:', process.env.REDIS_URL.replace(/:[^:@]+@/, ':***@')); // Hide password in logs

      redis = new Redis(process.env.REDIS_URL, {
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
