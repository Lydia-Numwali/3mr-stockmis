'use client';

import Button from '@/components/auth/Button';
import Input from '@/components/auth/Input';
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from '@/i18n/routing';
import { loginSchema } from '@/lib/schema/auth';
import { UtilsService } from '@/services/utils.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ClipLoader } from 'react-spinners';
import { toast } from 'sonner';
import { z } from 'zod';
import { useEffect, useState } from 'react';

type LoginInput = z.infer<typeof loginSchema>;

function Login() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const utils = new UtilsService();
  const loginMutation = useLogin();
  const router = useRouter();

  const onSubmit = async (data: LoginInput) => {
    loginMutation.mutate(data, {
      onSuccess: async (response: any) => {
        console.log('📦 Response object:', response);
        const token = response.accessToken || response.access_token;
        
        if (response.twoFactorEnabled) {
          toast.success("Two factor required");
          sessionStorage.setItem("partialAccessToken", token);
          router.push("/two-factor-auth");
        } else if (token) {
          console.log('💾 Setting cookie with token:', token.substring(0, 20) + '...');
          utils.setCookies("accessToken", token);
          console.log('✅ Cookie set, redirecting to dashboard');
          toast.success("Logged in successfully");
          utils.handleTokenAndRedirect({ token, router });
        } else {
          console.error('❌ No token in response:', response);
          toast.error("Login failed - no token received");
        }
      },
      onError: (error: any) => {
        console.error('Login error details:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
          fullError: error
        });
        
        let errorMsg = "Login failed";
        
        if (error?.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error?.response?.status === 401) {
          errorMsg = "Invalid email or password";
        } else if (error?.message) {
          errorMsg = error.message;
        }
        
        toast.error(errorMsg);
      },
    });
  };

  const loading = loginMutation.isPending;

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-10 border border-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Stock MIS</h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">Sign in to manage your inventory</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <Input
            {...register('email')}
            required
            label="Email Address"
            placeholder="admin@example.com"
            type="email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('password')}
            required
            label="Password"
            placeholder="••••••••"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          className={`mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md py-3 text-[16px] font-semibold transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-x-2">
              <ClipLoader size={20} color="#fff" />
              <span>Please wait...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </div>
  );
}

export default Login;
