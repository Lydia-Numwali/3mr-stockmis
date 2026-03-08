import { useAuth } from '@/context/auth/auth-provider';

export function usePermissions() {
    const { user } = useAuth();

    // A simplified permission check for stock MIS
    const hasPermission = (permissions: string[] | string) => {
        if (!user) return false;
        if (user.user_type === 'SUPER_ADMIN') return true;

        // Add more logic here if needed
        return true;
    };

    return { hasPermission, permissions: [] };
}
