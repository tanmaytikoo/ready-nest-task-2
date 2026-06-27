"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Calendar, Users, ClipboardList, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSidebar } from "@/components/providers/SidebarProvider";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/teacher/dashboard", color: "text-neutral-400" },
  { label: "Attendance", icon: Calendar, href: "/teacher/attendance", color: "text-neutral-400" },
  { label: "Assignments", icon: CheckSquare, href: "/teacher/assignments", color: "text-neutral-400" },
  { label: "Timetable", icon: Calendar, href: "/teacher/timetable", color: "text-neutral-400" },
  { label: "Notices", icon: ClipboardList, href: "/teacher/notices", color: "text-neutral-400" },
  { label: "Students", icon: Users, href: "/teacher/students", color: "text-neutral-400" },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={close}
        />
      )}
      <div className={cn(
        "metallic-sidebar flex-col bg-neutral-900 text-white overflow-hidden transition-all duration-300 ease-in-out z-50",
        "absolute md:relative left-0 top-0 md:left-auto md:top-auto h-[calc(100vh-2rem)] rounded-3xl",
        isOpen 
          ? "w-64 m-4 md:mr-0 border border-white/10 opacity-100 flex translate-x-0 shadow-2xl md:shadow-none" 
          : "w-64 md:w-0 m-4 md:m-0 opacity-0 md:border-none pointer-events-none -translate-x-full md:translate-x-0"
      )}>
      <Link href="/teacher/dashboard" className="h-16 flex items-center gap-3 px-6 border-b border-white/10 active:scale-95 transition-transform hover:opacity-80">
        <img src="/logo-transparent.png" alt="Nova Logo" className="w-8 h-8 object-contain" />
        <h1 className="font-bold text-2xl tracking-tight bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          Nova
        </h1>
      </Link>
      
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                prefetch={true}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive 
                    ? "bg-neutral-800 text-white" 
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                )}
              >
                <route.icon className={cn("w-5 h-5", route.color)} />
                {route.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => signOut({ redirectTo: "/login" })}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
    </>
  );
}
