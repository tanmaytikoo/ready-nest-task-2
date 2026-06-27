"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-16 border-b border-border/40 bg-card/30 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md hidden md:flex relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search for classes, assignments, notes..." 
          className="w-full pl-9 bg-muted/30 border-transparent focus-visible:ring-primary/30 focus-visible:bg-muted/50 transition-all rounded-full h-9"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-auto">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        )}
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </button>
        
        <div className="h-6 w-px bg-border/50 mx-1 hidden md:block"></div>
        
        <div className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full hover:bg-muted/50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/50 text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
            T
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">Tanmay</p>
            <p className="text-xs text-muted-foreground mt-0.5">Student</p>
          </div>
        </div>
      </div>
    </header>
  );
}
