import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  const pathname = nextUrl.pathname;

  // Always allow API routes through (including /api/auth/*)
  if (pathname.startsWith("/api/")) return NextResponse.next();

  // Static assets, etc. - let through
  if (pathname.startsWith("/_next")) return NextResponse.next();

  // Public routes
  const isPublicRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password";

  if (isPublicRoute) {
    if (isLoggedIn && role) {
      // Logged in user visiting login/register → redirect to their dashboard
      const dashboardUrl = role === "TEACHER" ? "/teacher/dashboard"
        : role === "ADMIN" ? "/admin/dashboard"
        : "/student/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
    }
    // Not logged in → show the page
    return NextResponse.next();
  }

  // Root "/" route
  if (pathname === "/") {
    if (isLoggedIn && role) {
      const dashboardUrl = role === "TEACHER" ? "/teacher/dashboard"
        : role === "ADMIN" ? "/admin/dashboard"
        : "/student/dashboard";
      return NextResponse.redirect(new URL(dashboardUrl, nextUrl));
    }
    return NextResponse.next();
  }

  // All other routes are protected
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Role-based route protection
  if (pathname.startsWith("/student") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  if (pathname.startsWith("/teacher") && role !== "TEACHER") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|svg|ico|css|js)$).*)"],
};
