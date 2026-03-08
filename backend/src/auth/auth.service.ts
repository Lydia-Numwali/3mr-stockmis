import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    console.log(`🔍 Login attempt for email: ${email}`);
    
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    console.log(`✅ User found: ${email}`);
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      console.log(`❌ Password mismatch for: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    
    console.log(`✅ Password valid for: ${email}`);
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return { accessToken: token, user: { id: user.id, email: user.email, role: user.role } };
  }
}
