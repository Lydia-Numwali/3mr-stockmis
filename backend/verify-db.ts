import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './src/entities/user.entity';
import { Product } from './src/entities/product.entity';
import { StockMovement } from './src/entities/stock-movement.entity';
import { Sale } from './src/entities/sale.entity';
import { Lending } from './src/entities/lending.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '123',
  database: process.env.DB_NAME || 'stockmis',
  entities: [User, Product, StockMovement, Sale, Lending],
  synchronize: true,
  logging: true,
});

async function main() {
  try {
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepo = AppDataSource.getRepository(User);

    // Check existing users
    const users = await userRepo.find();
    console.log(`\n📊 Found ${users.length} user(s):`);
    users.forEach(u => {
      console.log(`   - ID: ${u.id}, Email: ${u.email}, Role: ${u.role}`);
    });

    // Seed admin if not exists
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin@123456';
    
    const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log(`\n✅ Admin user already exists`);
    } else {
      console.log(`\n🌱 Seeding admin user...`);
      const hash = await bcrypt.hash(adminPassword, 10);
      const admin = await userRepo.save({
        email: adminEmail,
        passwordHash: hash,
        role: 'super-admin',
      });
      console.log(`✅ Admin user created:`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   ID: ${admin.id}`);
    }

    console.log('\n✅ Database verification complete');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
