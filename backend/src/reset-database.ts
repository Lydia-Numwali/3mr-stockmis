import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function resetDatabase() {
  // Use production DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL || process.env.PROD_DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ No DATABASE_URL found. Please set DATABASE_URL environment variable.');
    process.exit(1);
  }

  console.log('🔌 Connecting to database...');
  
  const dataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');

    console.log('🗑️  Dropping all tables...');
    
    // Drop all tables in order (to handle foreign keys)
    await dataSource.query('DROP TABLE IF EXISTS sales CASCADE;');
    console.log('   ✓ Dropped sales table');
    
    await dataSource.query('DROP TABLE IF EXISTS purchases CASCADE;');
    console.log('   ✓ Dropped purchases table');
    
    await dataSource.query('DROP TABLE IF EXISTS lendings CASCADE;');
    console.log('   ✓ Dropped lendings table');
    
    await dataSource.query('DROP TABLE IF EXISTS lending CASCADE;');
    console.log('   ✓ Dropped lending table (if exists)');
    
    await dataSource.query('DROP TABLE IF EXISTS stock_movements CASCADE;');
    console.log('   ✓ Dropped stock_movements table');
    
    await dataSource.query('DROP TABLE IF EXISTS products CASCADE;');
    console.log('   ✓ Dropped products table');
    
    await dataSource.query('DROP TABLE IF EXISTS report_history CASCADE;');
    console.log('   ✓ Dropped report_history table');
    
    await dataSource.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('   ✓ Dropped users table');

    console.log('✅ All tables dropped successfully!');
    console.log('');
    console.log('ℹ️  Next steps:');
    console.log('   1. Restart your backend service on Render');
    console.log('   2. Tables will be recreated automatically');
    console.log('   3. Admin user will be seeded: admin@centurion.com / Test@123');
    
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

resetDatabase();
