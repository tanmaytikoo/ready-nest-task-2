"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function HorizontalLiquidCard({
  percentage,
  title = "Attendance",
}: {
  percentage: number;
  title?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const isSafe = percentage >= 75;
  const isWarning = percentage >= 60 && percentage < 75;
  const liquidColor = isSafe ? "bg-primary" : isWarning ? "bg-yellow-500" : "bg-destructive";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-28 rounded-3xl bg-card backdrop-blur-xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 p-4 flex items-center justify-between relative overflow-hidden group cursor-pointer shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

      {/* Liquid Container */}
      <div
        className="absolute left-0 top-0 bottom-0 z-0 flex items-center justify-end"
        style={{ width: `${percentage}%`, transition: "width 1s ease-out" }}
      >
        {/* Solid body of the liquid */}
        <div className={`absolute inset-0 ${liquidColor} opacity-20 dark:opacity-40`}></div>

        {/* Waves at the right edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-48 h-48 pointer-events-none">
          <div
            className={`absolute inset-0 rounded-[40%] ${liquidColor} opacity-40 dark:opacity-60 transition-all duration-300 ${
              isHovered ? "animate-spin" : "animate-spin-slow"
            }`}
          ></div>
          <div
            className={`absolute inset-0 rounded-[45%] ${liquidColor} opacity-20 dark:opacity-40 transition-all duration-300 ${
              isHovered ? "animate-spin-reverse" : "animate-spin-slow-reverse"
            }`}
          ></div>
        </div>
      </div>

      <div className="z-10 flex flex-col justify-center pointer-events-none">
        <h3 className="text-muted-foreground text-xs font-medium">{title}</h3>
        <motion.p 
          className="text-2xl font-bold mt-1 text-foreground text-gradient"
          animate={{ scale: isHovered ? 1.1 : 1, originX: 0 }}
        >
          {percentage}%
        </motion.p>
      </div>
    </motion.div>
  );
}
