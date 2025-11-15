import { NextResponse } from 'next/server';
import { getRedis, isRedisAvailable } from '@/lib/redis';

/**
 * GET /api/diagnostics
 * Comprehensive diagnostic endpoint
 */
export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasRedisUrl: !!process.env.REDIS_URL,
      hasUpstashRedisUrl: !!process.env.UPSTASH_REDIS_REDIS_URL,
      hasUpstashKvUrl: !!process.env.UPSTASH_REDIS_KV_URL,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    },
    redis: {
      available: false,
      connected: false,
      ping: null,
      error: null
    },
    imports: {
      supplements: false,
      error: null
    }
  };

  // Test Redis connection
  try {
    const redis = getRedis();
    diagnostics.redis.available = isRedisAvailable();

    if (redis) {
      const ping = await redis.ping();
      diagnostics.redis.connected = ping === 'PONG';
      diagnostics.redis.ping = ping;
    }
  } catch (error) {
    diagnostics.redis.error = error instanceof Error ? error.message : String(error);
  }

  // Test imports
  try {
    const { supplements } = await import('@/data/products/supplements');
    diagnostics.imports.supplements = true;
    diagnostics.imports.supplementsCount = supplements.length;
  } catch (error) {
    diagnostics.imports.error = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json({
    success: true,
    data: diagnostics
  });
}
