import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effect for the entire app */}
      <div className="fixed inset-0 -z-10 bg-background transition-colors duration-500">
        <div className="absolute inset-0 bg-[url('/dashboard-bg.png')] bg-cover bg-center invert dark:invert-0 mix-blend-multiply dark:mix-blend-screen opacity-[0.15] dark:opacity-[0.25]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background to-background/90 z-0"></div>
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
