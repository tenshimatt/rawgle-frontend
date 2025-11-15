#!/usr/bin/env node
/**
 * Test Redis Connection
 *
 * This script tests the Redis connection and shows detailed diagnostics
 * Run: node scripts/test-redis.js
 */

const Redis = require('ioredis');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

console.log('🔍 Redis Connection Test\n');
console.log('========================================');
console.log('Environment Check:');
console.log('========================================');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('REDIS_URL:', process.env.REDIS_URL ? 'SET ✅' : 'NOT SET ❌');

if (process.env.REDIS_URL) {
  // Mask password in output
  const maskedUrl = process.env.REDIS_URL.replace(/:[^:@]+@/, ':***@');
  console.log('REDIS_URL format:', maskedUrl);
}

console.log('\n========================================');
console.log('Connection Test:');
console.log('========================================');

if (!process.env.REDIS_URL) {
  console.error('❌ REDIS_URL not set!');
  console.error('\nTo fix:');
  console.error('1. Copy .env.local.example to .env.local');
  console.error('2. Set REDIS_URL in .env.local');
  console.error('3. For local: REDIS_URL=redis://localhost:6379');
  console.error('4. For cloud: REDIS_URL=redis://default:PASSWORD@HOST:PORT');
  process.exit(1);
}

let redis;
let connected = false;
let testsPassed = 0;
let testsFailed = 0;

try {
  console.log('Connecting to Redis...');
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) {
        console.error('❌ Max retries reached');
        return null;
      }
      const delay = Math.min(times * 100, 2000);
      console.log(`⏳ Retry attempt ${times}, waiting ${delay}ms...`);
      return delay;
    }
  });

  redis.on('connect', () => {
    console.log('✅ Connected to Redis');
    connected = true;
  });

  redis.on('ready', () => {
    console.log('✅ Redis ready for commands');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis error:', err.message);
  });

  redis.on('close', () => {
    console.log('Connection closed');
  });

  // Wait for connection
  await new Promise((resolve) => {
    const checkConnection = setInterval(() => {
      if (connected) {
        clearInterval(checkConnection);
        resolve();
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkConnection);
      if (!connected) {
        console.error('❌ Connection timeout after 5 seconds');
        process.exit(1);
      }
    }, 5000);
  });

  console.log('\n========================================');
  console.log('Running Tests:');
  console.log('========================================');

  // Test 1: PING
  console.log('\n1. Testing PING...');
  const pingResult = await redis.ping();
  if (pingResult === 'PONG') {
    console.log('   ✅ PING successful');
    testsPassed++;
  } else {
    console.log('   ❌ PING failed, got:', pingResult);
    testsFailed++;
  }

  // Test 2: SET
  console.log('\n2. Testing SET...');
  const setResult = await redis.set('test:key', 'test-value', 'EX', 10);
  if (setResult === 'OK') {
    console.log('   ✅ SET successful');
    testsPassed++;
  } else {
    console.log('   ❌ SET failed');
    testsFailed++;
  }

  // Test 3: GET
  console.log('\n3. Testing GET...');
  const getValue = await redis.get('test:key');
  if (getValue === 'test-value') {
    console.log('   ✅ GET successful, value:', getValue);
    testsPassed++;
  } else {
    console.log('   ❌ GET failed, got:', getValue);
    testsFailed++;
  }

  // Test 4: DELETE
  console.log('\n4. Testing DEL...');
  const delResult = await redis.del('test:key');
  if (delResult === 1) {
    console.log('   ✅ DEL successful');
    testsPassed++;
  } else {
    console.log('   ❌ DEL failed');
    testsFailed++;
  }

  // Test 5: SETEX (used for sessions)
  console.log('\n5. Testing SETEX (session simulation)...');
  const setexResult = await redis.setex('test:session', 30, JSON.stringify({ userId: 'test123' }));
  if (setexResult === 'OK') {
    console.log('   ✅ SETEX successful');
    const sessionData = await redis.get('test:session');
    const parsed = JSON.parse(sessionData);
    if (parsed.userId === 'test123') {
      console.log('   ✅ Session data verified');
      testsPassed++;
    } else {
      console.log('   ❌ Session data mismatch');
      testsFailed++;
    }
    await redis.del('test:session');
  } else {
    console.log('   ❌ SETEX failed');
    testsFailed++;
  }

  // Test 6: Auth keys check
  console.log('\n6. Checking auth keys...');
  const authKeys = await redis.keys('auth:*');
  console.log(`   Found ${authKeys.length} auth keys`);
  if (authKeys.length > 0) {
    console.log('   Keys:', authKeys.slice(0, 5).join(', '), authKeys.length > 5 ? '...' : '');
  }

  // Summary
  console.log('\n========================================');
  console.log('Test Summary:');
  console.log('========================================');
  console.log(`✅ Tests passed: ${testsPassed}`);
  console.log(`❌ Tests failed: ${testsFailed}`);

  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed! Redis is working correctly.');
    console.log('\nYou can now run: npm run dev');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    process.exit(1);
  }

} catch (error) {
  console.error('\n❌ Fatal error:', error.message);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
} finally {
  if (redis) {
    console.log('\nClosing connection...');
    await redis.quit();
    console.log('✅ Connection closed');
  }
  process.exit(testsFailed > 0 ? 1 : 0);
}
