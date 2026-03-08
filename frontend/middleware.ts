import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { jwtDecode } from "jwt-decode";

// Define protected routes (require authentication)
const protectedRoutes = [
  "/super-admin",
  "/super-operator",
  "/visitor",
  "/employee",
];

// Define auth routes (should not be accessible when logged in)
const unauthenticatedRoutes = [
  "/login",
  "/register",
  "/new-password",
  "/reset-password",
];


// Create the intl middleware first
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // First, check if the request is for a supported locale
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1] || "en";

  // Check if the requested locale is supported
  if (!routing.locales.includes(locale as any)) {
    return NextResponse.redirect(new URL(`/en/not-found`, request.url));
  }

  // Handle static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    pathname.includes(".") // static files
  ) {
    return intlMiddleware(request);
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(`/${locale}${route}`)
  );

  // Check if the route should only be accessible to unauthenticated users
  const isUnauthenticatedRoute =
    pathname === `/${locale}` ||
    unauthenticatedRoutes.some(
      (route) =>
        pathname.startsWith(`/${locale}${route}`) ||
        (locale === "en" && pathname.startsWith(route))
    );

  // Handle auth routes for authenticated users
  if (isUnauthenticatedRoute && accessToken) {
    try {
      const decoded: any = jwtDecode(accessToken);
      // Check both user_type and role fields for compatibility
      const userType = decoded.user_type || decoded.role;
      
      if (userType === "SUPER_ADMIN" || userType === "super-admin") {
        return NextResponse.redirect(
          new URL(`/${locale}/super-admin/dashboard`, request.url)
        );
      } else if (userType === "OPERATOR" || userType === "super-operator") {
        return NextResponse.redirect(
          new URL(`/${locale}/super-operator/dashboard`, request.url)
        );
      } else if (userType === "EMPLOYEE" || userType === "employee") {
        return NextResponse.redirect(
          new URL(`/${locale}/employee/dashboard`, request.url)
        );
      } else if (userType === "VISITOR" || userType === "visitor") {
        return NextResponse.redirect(
          new URL(`/${locale}/visitor/dashboard`, request.url)
        );
      }
    } catch (error) {
      // Invalid token, clear cookies and proceed to auth page
      const response = NextResponse.next();
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  if (pathname === `/${locale}`) {
    return NextResponse.redirect(
      new URL(`/${locale}/login`, request.url)
    );
  }

  // Handle protected routes for unauthenticated users
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Handle protected routes based on roles
  if (accessToken && isProtectedRoute) {
    try {
      const decoded: any = jwtDecode(accessToken);
      // Check both user_type and role fields for compatibility
      const userType = decoded.user_type || decoded.role;

      // Admin routes
      if (
        pathname.startsWith(`/${locale}/super-admin`) &&
        userType !== "SUPER_ADMIN" &&
        userType !== "super-admin"
      ) {
        return NextResponse.redirect(
          new URL(`/${locale}/unauthorized`, request.url)
        );
      }

      // Supervisor routes
      if (
        pathname.startsWith(`/${locale}/super-operator`) &&
        userType !== "OPERATOR" &&
        userType !== "super-operator"
      ) {
        return NextResponse.redirect(
          new URL(`/${locale}/unauthorized`, request.url)
        );
      }

      // Employee routes
      if (
        pathname.startsWith(`/${locale}/employee`) &&
        userType !== "EMPLOYEE" &&
        userType !== "employee"
      ) {
        return NextResponse.redirect(
          new URL(`/${locale}/unauthorized`, request.url)
        );
      }

      // Visitor routes
      if (
        pathname.startsWith(`/${locale}/visitor`) &&
        userType !== "VISITOR" &&
        userType !== "visitor"
      ) {
        return NextResponse.redirect(
          new URL(`/${locale}/unauthorized`, request.url)
        );
      }
    } catch (error) {
      // Invalid token, clear cookies and redirect to login
      const response = NextResponse.redirect(
        new URL(`/${locale}/login`, request.url)
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  // Handle malformed reset password URLs from backend
  const url = request.nextUrl.clone();
  if (
    url.pathname.includes("reset-password") &&
    url.search.includes("token=")
  ) {
    // Extract token from URL
    const tokenMatch = url.href.match(/token=([a-zA-Z0-9]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      // Redirect to the correct new-password page with locale
      url.pathname = "/en/new-password";
      url.search = `?token=${token}`;
      return NextResponse.redirect(url);
    }
  }

  // Handle URLs with comment text that might be malformed
  if (url.href.includes("#") && url.href.includes("reset-password")) {
    // Try to extract token from the malformed URL
    const tokenMatch = url.href.match(/token=([a-zA-Z0-9]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      // Create clean URL
      const cleanUrl = new URL(request.url);
      cleanUrl.pathname = "/en/new-password";
      cleanUrl.search = `?token=${token}`;
      cleanUrl.hash = "";
      return NextResponse.redirect(cleanUrl);
    }
  }

  // Apply the intl middleware for all other cases
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|fr|ki)/:path*"],
};
