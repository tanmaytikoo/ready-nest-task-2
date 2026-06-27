"use client";

import { motion } from "framer-motion";

export function LiquidFill({ percentage, size = 56, className = "" }: { percentage: number, size?: number, className?: string }) {
  const isSafe = percentage >= 75;
  const isWarning = percentage >= 60 && percentage < 75;
  
  const liquidColor = isSafe 
    ? "bg-primary" 
    : isWarning 
      ? "bg-yellow-500" 
      : "bg-destructive";

  return (
    <div 
      className={`relative rounded-full overflow-hidden border-2 border-border/50 bg-background/50 flex items-center justify-center shadow-inner ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Percentage Text (optional, if we want it inside, but we have it outside) */}
      
      {/* Liquid Container */}
      <div className="absolute bottom-0 w-full flex justify-center items-center" style={{ height: `${percentage}%`, transition: 'height 1s ease-in-out' }}>
        <div className={`absolute w-[200%] h-[200%] rounded-[40%] ${liquidColor} opacity-80 animate-spin-slow`} style={{ bottom: '0%' }}></div>
        <div className={`absolute w-[210%] h-[210%] rounded-[45%] ${liquidColor} opacity-50 animate-spin-slow-reverse`} style={{ bottom: '-5%' }}></div>
        <div className={`absolute w-full h-full ${liquidColor} bottom-0`}></div>
      </div>
    </div>
  );
}
