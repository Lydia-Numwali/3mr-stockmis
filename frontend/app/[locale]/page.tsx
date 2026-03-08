"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";

export default function RootPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      router.push(`/new-password?token=${token}`);
      return;
    }

    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;

      if (
        currentUrl.includes("reset-password") &&
        currentUrl.includes("token=")
      ) {
        const tokenMatch = currentUrl.match(/token=([a-zA-Z0-9]+)/);
        if (tokenMatch) {
          const extractedToken = tokenMatch[1];
          router.push(`/new-password?token=${extractedToken}`);
          return;
        }
      }
    }

    // Default redirect to login for authenticated users or login page
    router.push("/login");
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-gray-600">
          Please wait while we redirect you to the appropriate page.
        </p>
      </div>
    </div>
  );
}
