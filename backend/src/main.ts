import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`✅ Server running on port ${port}`);

  // Seed admin user
  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);
  
  try {
    const exists = await userRepo.findOne({ where: { email: 'admin@example.com' } });
    if (exists) {
      console.log('✅ Admin user already exists');
    } else {
      const hash = await bcrypt.hash('Admin@123456', 10);
      const admin = await userRepo.save({ 
        email: 'admin@example.com', 
        passwordHash: hash, 
        role: 'super-admin' 
      });
      console.log('✅ Admin seeded successfully');
      console.log(`   Email: admin@example.com`);
      console.log(`   Password: Admin@123456`);
      console.log(`   ID: ${admin.id}`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
}
bootstrap();
