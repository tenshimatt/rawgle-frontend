#!/usr/bin/env ts-node

/**
 * Admin Seed Script
 *
 * This script initializes the default super admin user.
 * Run with: npx ts-node scripts/seed-admin.ts
 *
 * Or add to package.json scripts:
 * "seed:admin": "ts-node scripts/seed-admin.ts"
 */

import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.local') });
config({ path: path.resolve(process.cwd(), '.env') });

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin seed process...\n');

    // Import after env vars are loaded
    const { initializeDefaultAdmin, getAdminUser } = await import('../src/lib/auth/admin');

    // Check if admin already exists
    const existingAdmin = await getAdminUser('admin@rawgle.com');

    if (existingAdmin) {
      console.log('✅ Default admin already exists');
      console.log(`   Email: admin@rawgle.com`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log('\n⚠️  If you need to reset the password, please delete the existing admin first.\n');
      process.exit(0);
    }

    // Initialize default admin
    const result = await initializeDefaultAdmin();

    if (result) {
      console.log('\n✅ Admin seed completed successfully!\n');
      process.exit(0);
    } else {
      console.error('\n❌ Failed to seed admin\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error seeding admin:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAdmin();
