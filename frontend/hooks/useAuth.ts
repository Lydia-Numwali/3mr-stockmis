import { useMutation, useQuery } from '@tanstack/react-query';
import { UtilsService } from '@/services/utils.service';

const utilsService = new UtilsService();

export interface IUser {
    id: number;
    email: string;
    role: string;
    isVerified?: boolean;
    user_type?: string;
    profileImageUrl?: string;
    firstName?: string;
    lastName?: string;
    institutions?: any[];
}

export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials: any) => {
            console.log('🔐 Attempting login with email:', credentials.email);
            try {
                const response = await utilsService.unauthorizedAPI().post('/auth/login', credentials);
                console.log('✅ Login response received:', response.data);
                return response.data;
            } catch (error: any) {
                console.error('❌ Login request failed:', {
                    status: error?.response?.status,
                    statusText: error?.response?.statusText,
                    data: error?.response?.data,
                    message: error?.message,
                });
                throw error;
            }
        },
    });
};

export const useGetProfile = () => {
    return useQuery<IUser>({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await utilsService.authorizedAPI().get('/auth/profile');
            return response.data;
        },
        retry: false,
    });
};
