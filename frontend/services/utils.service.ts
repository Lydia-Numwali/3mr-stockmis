import { Cookies } from 'react-cookie';
import { authorizedAPI, unauthorizedAPI } from '@/config/axios.config';

export class UtilsService {
    private cookies = new Cookies();

    authorizedAPI() {
        return authorizedAPI;
    }

    unauthorizedAPI() {
        return unauthorizedAPI;
    }

    setCookies(name: string, value: string, options?: any) {
        this.cookies.set(name, value, { path: '/', ...options });
    }

    getCookies(name: string) {
        return this.cookies.get(name);
    }

    removeCookies(name: string, options?: any) {
        this.cookies.remove(name, { path: '/', ...options });
    }

    handleTokenAndRedirect({ token, router }: { token: string; router: any }) {
        // Store in both cookies and localStorage for reliability
        this.setCookies('accessToken', token);
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
            console.log('💾 Token stored in localStorage and cookies');
        }
        // Use a small delay to ensure storage is complete
        setTimeout(() => {
            router.push('/super-admin/dashboard');
        }, 50);
    }

    handleUnauthorized() {
        this.removeCookies('accessToken');
    }
}
