#!/usr/bin/env node
/**
 * Scan existing Redis data to see what we have
 *
 * Usage: REDIS_URL=your_redis_url node scripts/scan-redis-data.js
 */

const Redis = require('ioredis');

// Get Redis URL from command line or env
const redisUrl = process.argv[2] || process.env.REDIS_URL || process.env.rawgle_REDIS_URL;

if (!redisUrl) {
  console.error('❌ No Redis URL provided!');
  console.error('\nUsage:');
  console.error('  REDIS_URL=redis://... node scripts/scan-redis-data.js');
  console.error('  or');
  console.error('  node scripts/scan-redis-data.js redis://...');
  process.exit(1);
}

console.log('🔍 Scanning Redis Database\n');
console.log('========================================');
console.log('Connecting to:', redisUrl.replace(/:[^:@]+@/, ':***@'));
console.log('========================================\n');

let redis;

async function scanRedis() {
  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
    });

    await redis.ping();
    console.log('✅ Connected successfully!\n');

    // Get all keys by pattern
    const patterns = [
      'auth:*',
      'supplier:*',
      'product:*',
      'cart:*',
      'order:*',
      'recipe:*',
      'forum:*',
      '*'  // Catch-all
    ];

    const keyStats = {};

    for (const pattern of patterns) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        keyStats[pattern] = keys.length;
      }
    }

    console.log('📊 Key Statistics:');
    console.log('========================================');

    if (Object.keys(keyStats).length === 0) {
      console.log('⚠️  No keys found - database is empty');
    } else {
      for (const [pattern, count] of Object.entries(keyStats)) {
        console.log(`${pattern.padEnd(20)} → ${count} keys`);
      }
    }

    // Get total keys
    const dbsize = await redis.dbsize();
    console.log('\n========================================');
    console.log(`Total keys in database: ${dbsize}`);
    console.log('========================================\n');

    // Sample some keys
    console.log('📋 Sample Keys (first 20):');
    console.log('========================================');
    const allKeys = await redis.keys('*');
    const sampleKeys = allKeys.slice(0, 20);

    for (const key of sampleKeys) {
      const type = await redis.type(key);
      const ttl = await redis.ttl(key);
      const ttlInfo = ttl > 0 ? `(TTL: ${ttl}s)` : ttl === -1 ? '(no expiry)' : '(expired)';
      console.log(`  ${key} [${type}] ${ttlInfo}`);
    }

    if (allKeys.length > 20) {
      console.log(`  ... and ${allKeys.length - 20} more keys`);
    }

    // Check for specific data
    console.log('\n🔍 Checking for specific data:');
    console.log('========================================');

    // Suppliers
    const supplierKeys = await redis.keys('supplier:*');
    if (supplierKeys.length > 0) {
      console.log(`✅ Suppliers: ${supplierKeys.length} records found`);
      // Sample one
      const sample = await redis.get(supplierKeys[0]);
      console.log(`   Sample: ${supplierKeys[0]}`);
      if (sample) {
        try {
          const data = JSON.parse(sample);
          console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
        } catch (e) {
          console.log(`   Data (raw): ${sample.substring(0, 100)}...`);
        }
      }
    } else {
      console.log('❌ Suppliers: No records found');
    }

    // Auth
    const authUserKeys = await redis.keys('auth:users:*');
    console.log(`${authUserKeys.length > 0 ? '✅' : '❌'} Auth Users: ${authUserKeys.length} records`);

    // Products
    const productKeys = await redis.keys('product:*');
    console.log(`${productKeys.length > 0 ? '✅' : '❌'} Products: ${productKeys.length} records`);

    // Sessions
    const sessionKeys = await redis.keys('auth:sessions:*');
    console.log(`${sessionKeys.length > 0 ? '✅' : '❌'} Sessions: ${sessionKeys.length} records`);

    // Get memory usage
    const info = await redis.info('memory');
    const memMatch = info.match(/used_memory_human:(.+)/);
    if (memMatch) {
      console.log(`\n💾 Memory Usage: ${memMatch[1].trim()}`);
    }

    console.log('\n========================================');
    console.log('✅ Scan complete!');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nFull error:');
    console.error(error);
    process.exit(1);
  } finally {
    if (redis) {
      await redis.quit();
    }
  }
}

scanRedis();
