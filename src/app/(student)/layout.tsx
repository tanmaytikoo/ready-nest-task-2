import { StudentSidebar } from "@/components/student/StudentSidebar";
import { TopBar } from "@/components/student/TopBar";

import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background relative">
        <img 
          src="/dashboard-bg.png" 
          alt="App Background" 
          className="fixed inset-0 z-0 w-full h-full object-cover opacity-[0.28] mix-blend-multiply dark:mix-blend-screen pointer-events-none dark:invert-0 invert" 
        />
        <StudentSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
