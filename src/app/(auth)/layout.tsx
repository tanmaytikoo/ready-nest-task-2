import Image from "next/image";
import { Meteors } from "@/components/ui/meteors";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex text-foreground relative overflow-hidden">
      {/* Dynamic Stardust Background */}
      <div className="fixed inset-0 -z-10 bg-background transition-colors duration-500">
        <Meteors number={30} />
        <div className="absolute inset-0 bg-[url('/dashboard-bg.png')] bg-cover bg-center invert dark:invert-0 mix-blend-multiply dark:mix-blend-screen opacity-60 dark:opacity-40 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background z-0"></div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-8 z-10 relative">
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image src="/logo-transparent.png" alt="Nova Logo" fill className="object-contain [filter:brightness(0)] dark:[filter:brightness(1)]" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-gradient">Nova</span>
        </div>
        
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
