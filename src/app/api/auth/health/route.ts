import { NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';
import { getStorageStats } from '@/lib/auth-storage';

/**
 * GET /api/auth/health
 * Health check endpoint for authentication system
 */
export async function GET() {
  try {
    const redis = getRedis();
    const redisAvailable = isRedisAvailable();

    // Get storage stats
    const stats = await getStorageStats();

    // Check Redis connection
    let redisConnected = false;
    let redisPing: string | null = null;
    if (redis) {
      try {
        redisPing = await redis.ping();
        redisConnected = redisPing === 'PONG';
      } catch (error) {
        console.error('[AUTH Health] Redis ping failed:', error);
      }
    }

    const health = {
      status: redisConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        redisUrlConfigured: !!process.env.REDIS_URL,
        authDebug: process.env.AUTH_DEBUG === 'true'
      },
      redis: {
        available: redisAvailable,
        connected: redisConnected,
        ping: redisPing
      },
      storage: stats,
      services: {
        userAuthentication: redisConnected,
        sessionManagement: redisConnected,
        passwordReset: redisConnected,
        rateLimit: redisConnected
      }
    };

    const statusCode = redisConnected ? 200 : 503;

    return NextResponse.json(
      {
        success: redisConnected,
        data: health,
        message: redisConnected
          ? 'Authentication system healthy'
          : 'Redis not available - authentication features degraded'
      },
      { status: statusCode }
    );
  } catch (error) {
    console.error('[AUTH Health] Health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
