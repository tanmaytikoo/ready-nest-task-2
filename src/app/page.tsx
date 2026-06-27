"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Meteors } from "@/components/ui/meteors";

export default function LandingPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center">
      {/* Dynamic Stardust Background */}
      <div className="fixed inset-0 -z-10 bg-background transition-colors duration-500">
        <Meteors number={40} />
        <div className="absolute inset-0 bg-[url('/dashboard-bg.png')] bg-cover bg-center invert dark:invert-0 mix-blend-multiply dark:mix-blend-screen opacity-[0.38] dark:opacity-[0.28] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background z-0"></div>
      </div>

      {/* Ambient Glow Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* ─── NAVBAR ─── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl mt-6 px-4 md:px-8 z-50"
      >
        <div className="h-16 rounded-full flex items-center justify-between px-6 border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 bg-neutral-500/10 dark:bg-card/60 text-foreground backdrop-blur-xl shadow-2xl">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/logo-transparent.png"
              alt="Nova Logo"
              className="w-8 h-8 object-contain [filter:brightness(0)] dark:[filter:brightness(1)]"
            />
            <h1 className="font-bold text-xl tracking-tight text-gradient">Nova</h1>
          </a>
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => {
                  const currentTheme = theme === "system" ? resolvedTheme : theme;
                  setTheme(currentTheme === "dark" ? "light" : "dark");
                }}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full"
              >
                {(theme === "system" ? resolvedTheme : theme) === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}
            <div className="hidden md:block w-px h-6 bg-border/50"></div>
            <a
              href="/login"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </a>
            <a href="/register">
              <Button className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </motion.header>

      {/* ─── HERO SECTION ─── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="w-full max-w-6xl px-4 md:px-8 mt-20 md:mt-28 z-10 flex flex-col items-center text-center flex-1"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium mb-8 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4" />
          The future of student productivity
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter max-w-5xl text-gradient pb-2 leading-[0.9]"
        >
          Your Academic
          <br />
          Command Center
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed"
        >
          Nova brings your attendance, tasks, notes, and progress together into
          one stunning interface designed to help you excel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <a href="/register">
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-base bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
            >
              Start for free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <a href="/login">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-14 text-base border-border/50 bg-card/30 backdrop-blur-md hover:bg-card/50 transition-all"
            >
              Sign in to your dashboard
            </Button>
          </a>
        </motion.div>
      </motion.section>


    </div>
  );
}
