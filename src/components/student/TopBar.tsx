"use client";

import { useSession } from "next-auth/react";
import { Bell, Menu, X, Moon, Sun } from "lucide-react";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState, useEffect } from "react";

export function TopBar() {
  const { data: session } = useSession();
  const { isOpen, toggle } = useSidebar();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const role = (session?.user as any)?.role;
  const portalLabel = role === "ADMIN" ? "Admin Portal" : role === "TEACHER" ? "Faculty Portal" : "Student Portal";
  const profileHref = role === "ADMIN" ? "/admin/profile" : role === "TEACHER" ? "/teacher/profile" : "/student/profile";

  return (
    <header className="h-14 mt-4 mx-4 md:mx-8 rounded-full flex items-center justify-between px-5 border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 bg-neutral-500/10 dark:bg-card/60 text-foreground backdrop-blur-xl sticky top-4 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggle} 
          className="flex items-center justify-center w-9 h-9 -ml-2 rounded-full bg-neutral-800 border border-border/40 text-white hover:bg-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 transition-all active:scale-95 shadow-sm"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
        <a href="/" className="flex items-center gap-2 md:hidden active:scale-95 transition-transform">
          <img src="/logo-transparent.png" alt="Nova Logo" className="w-5 h-5 object-contain [filter:brightness(0)] dark:[filter:brightness(1)]" />
          <h2 className="text-base font-semibold bg-gradient-to-r from-neutral-700 to-neutral-500 dark:from-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent">
            Nova
          </h2>
        </a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            const currentTheme = theme === "system" ? resolvedTheme : theme;
            setTheme(currentTheme === "dark" ? "light" : "dark");
          }}
          className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full"
        >
          <span className="sr-only">Toggle theme</span>
          {mounted ? ((theme === "system" ? resolvedTheme : theme) === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />) : <div className="w-5 h-5" />}
        </button>

        <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border/40">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{session?.user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground">{portalLabel}</span>
          </div>
          <Link href={profileHref} prefetch={true} className="transition-transform active:scale-95">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold ring-2 ring-primary/20 overflow-hidden hover:ring-primary/50 transition-all shadow-sm">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                session?.user?.name?.charAt(0) || "U"
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
