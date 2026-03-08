import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private authService;
    private userRepo;
    constructor(authService: AuthService, userRepo: Repository<User>);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: string;
        };
    }>;
    debugUsers(): Promise<{
        count: number;
        users: {
            id: number;
            email: string;
            role: string;
        }[];
    }>;
}
export {};
