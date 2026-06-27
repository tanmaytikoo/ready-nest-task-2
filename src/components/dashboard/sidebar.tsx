"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CalendarDays, 
  CheckSquare, 
  BookOpen, 
  Settings,
  LogOut,
  UserCheck
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Timetable", href: "/timetable", icon: CalendarDays },
  { name: "Attendance", href: "/attendance", icon: UserCheck },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Notes", href: "/notes", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full border-r border-border/40 bg-card/50 backdrop-blur-xl flex flex-col hidden md:flex">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/logo-transparent.png"
            alt="Nova Logo"
            className="w-6 h-6 object-contain [filter:brightness(0)] dark:[filter:brightness(1)]"
          />
          <h1 className="font-bold text-lg tracking-tight text-gradient">Nova</h1>
        </a>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border/40 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200">
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
