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
        accessToken: string;
        user: {
            id: number;
            email: string;
            role: string;
        };
    }>;
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        role: string;
        isVerified: boolean;
    }>;
    debugUsers(): Promise<{
        count: number;
        users: {
            id: number;
            email: string;
            role: string;
            hasPasswordHash: boolean;
        }[];
        error?: undefined;
    } | {
        error: any;
        count?: undefined;
        users?: undefined;
    }>;
    test(): Promise<{
        message: string;
        timestamp: Date;
    }>;
}
export {};
