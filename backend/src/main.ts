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
    const exists = await userRepo.findOne({ where: { email: 'admin@centurion.com' } });
    if (exists) {
      console.log('✅ Admin user already exists');
    } else {
      const hash = await bcrypt.hash('Test@123', 10);
      const admin = await userRepo.save({ 
        email: 'admin@centurion.com', 
        passwordHash: hash, 
        role: 'super-admin' 
      });
      console.log('✅ Admin seeded successfully');
      console.log(`   Email: admin@centurion.com`);
      console.log(`   Password: Test@123`);
      console.log(`   ID: ${admin.id}`);
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
}
bootstrap();
