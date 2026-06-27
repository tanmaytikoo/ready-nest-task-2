import type { NextAuthConfig } from "next-auth";

// This config is Edge-safe (no Node-only imports like pg, prisma, bcrypt)
// Used by middleware to verify JWT tokens without touching the database
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.picture = user.image;
      }
      if (trigger === "update" && session) {
        if (session.image !== undefined) token.picture = session.image;
        if (session.name !== undefined) token.name = session.name;
        if (session.email !== undefined) token.email = session.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.picture as string | undefined;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const role = auth?.user?.role;

      const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password";
      const isApiRoute = pathname.startsWith("/api/");

      // Always allow API routes
      if (isApiRoute) return true;

      if (pathname === "/") {
        if (isLoggedIn && role) {
          if (role === "TEACHER") return Response.redirect(new URL("/teacher/dashboard", nextUrl));
          if (role === "ADMIN") return Response.redirect(new URL("/admin/dashboard", nextUrl));
          return Response.redirect(new URL("/student/dashboard", nextUrl));
        }
        return true;
      }

      // Auth pages: allow if not logged in, redirect to dashboard if logged in
      if (isAuthPage) {
        if (isLoggedIn) {
          if (role === "TEACHER") {
            return Response.redirect(new URL("/teacher/dashboard", nextUrl));
          } else if (role === "ADMIN") {
            return Response.redirect(new URL("/admin/dashboard", nextUrl));
          }
          return Response.redirect(new URL("/student/dashboard", nextUrl));
        }
        return true;
      }

      // Protected pages: require login
      if (!isLoggedIn) return false; // This will redirect to signIn page

      // Role-based protection
      if (pathname.startsWith("/student") && role !== "STUDENT") {
        return Response.redirect(new URL("/login", nextUrl)); // Or show unauthorized
      }
      if (pathname.startsWith("/teacher") && role !== "TEACHER") {
        return Response.redirect(new URL("/login", nextUrl));
      }
      if (pathname.startsWith("/admin") && role !== "ADMIN") {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Providers are added in auth.ts (they need DB access)
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
