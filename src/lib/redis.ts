import Redis from 'ioredis';

let redis: Redis | null = null;
let redisAvailable = false;

/**
 * Get Redis client instance
 * Lazy initialization with connection pooling
 */
export function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('[Redis] REDIS_URL not configured, data persistence disabled');
    return null;
  }

  if (redis === null) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            console.error('[Redis] Max retries reached, giving up');
            return null;
          }
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
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
        redisAvailable = true;
      });

      redis.on('error', (err) => {
        console.error('[Redis] Connection error:', err.message);
        redisAvailable = false;
      });

      redis.on('ready', () => {
        console.log('[Redis] Ready to accept commands');
        redisAvailable = true;
      });

    } catch (error) {
      console.error('[Redis] Failed to initialize:', error);
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
