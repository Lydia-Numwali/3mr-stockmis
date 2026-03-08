import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsString } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

class LoginDto {
  @IsString() email: string;
  @IsString() password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    console.log('📨 Login request received:', { email: dto.email });
    try {
      const result = await this.authService.login(dto.email, dto.password);
      console.log('✅ Login successful for:', dto.email);
      return result;
    } catch (error) {
      console.error('❌ Login error:', error.message);
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    console.log('📋 Profile request for user:', req.user.email);
    const user = await this.userRepo.findOne({ where: { id: req.user.userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: true,
    };
  }

  @Get('debug/users')
  async debugUsers() {
    try {
      const users = await this.userRepo.find();
      console.log(`📊 Found ${users.length} users`);
      return { 
        count: users.length, 
        users: users.map(u => ({ 
          id: u.id, 
          email: u.email, 
          role: u.role,
          hasPasswordHash: !!u.passwordHash 
        })) 
      };
    } catch (error) {
      console.error('❌ Debug error:', error);
      return { error: error.message };
    }
  }

  @Get('test')
  async test() {
    return { message: 'Backend is working', timestamp: new Date() };
  }
}
