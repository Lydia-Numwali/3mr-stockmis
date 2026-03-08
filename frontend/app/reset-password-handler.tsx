'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      
      // Extract token from any URL format
      const tokenMatch = currentUrl.match(/token=([a-zA-Z0-9]+)/);
      
      if (tokenMatch) {
        const token = tokenMatch[1];
        // Redirect to the correct new-password page
        router.replace(`/en/new-password?token=${token}`);
      } else {
        // No token found, redirect to password reset request page
        router.replace('/en/reset-password');
      }
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-xl h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing your request...</h2>
        <p className="text-gray-600">Redirecting you to the password reset page.</p>
      </div>
    </div>
  );
} 