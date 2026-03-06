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

  await app.listen(process.env.PORT || 3001);

  // Seed admin user
  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);
  const exists = await userRepo.findOne({ where: { username: 'admin' } });
  if (!exists) {
    const hash = await bcrypt.hash('admin123', 10);
    await userRepo.save({ username: 'admin', passwordHash: hash, role: 'manager' });
    console.log('✅ Admin seeded: admin / admin123');
  }
}
bootstrap();
