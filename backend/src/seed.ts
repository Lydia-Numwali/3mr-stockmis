import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const userRepository = app.get('UserRepository');

  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin@123456';

  try {
    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await app.close();
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = userRepository.create({
      email: adminEmail,
      passwordHash,
      role: 'super-admin',
    });

    await userRepository.save(admin);
    console.log(`✓ Admin user created successfully`);
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await app.close();
  }
}

seed();
