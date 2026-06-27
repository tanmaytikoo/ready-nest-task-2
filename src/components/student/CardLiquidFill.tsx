"use client";

import { motion } from "framer-motion";

export function CardLiquidFill({ percentage }: { percentage: number }) {
  return (
    <motion.div 
      className="absolute inset-0 z-0 cursor-pointer"
      initial="initial"
      animate="animate"
    >
      <motion.div 
        className="absolute bottom-0 left-0 w-full bg-foreground z-0" 
        variants={{
          initial: { height: `${percentage}%` },
          animate: { height: `${percentage}%` },
          hover: { height: `${Math.min(percentage + 4, 100)}%` },
          tap: { height: `${Math.max(percentage - 3, 0)}%` }
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Back Wave (Moves Left) */}
        <motion.div 
          className="absolute left-0 w-[200%] -translate-y-[99%] text-foreground opacity-30 h-6 md:h-10"
          style={{ transformOrigin: "bottom" }}
          variants={{
            initial: { x: "0%", scaleY: 1 },
            animate: { x: "-50%", scaleY: 1, transition: { x: { repeat: Infinity, duration: 6, ease: "linear" } } },
            hover: { x: "-50%", scaleY: 1.5, transition: { x: { repeat: Infinity, duration: 2.5, ease: "linear" }, scaleY: { type: "spring", stiffness: 300 } } },
            tap: { x: "-50%", scaleY: 0.5, transition: { x: { repeat: Infinity, duration: 2.5, ease: "linear" } } }
          }}
        >
          <svg viewBox="0 0 800 50" preserveAspectRatio="none" className="w-full h-full">
            <path d="M 0 25 Q 100 10, 200 25 T 400 25 T 600 25 T 800 25 L 800 50 L 0 50 Z" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Middle Wave (Moves Right) */}
        <motion.div 
          className="absolute left-0 w-[200%] -translate-y-[99%] text-foreground opacity-50 h-5 md:h-8"
          style={{ transformOrigin: "bottom" }}
          variants={{
            initial: { x: "-50%", scaleY: 1 },
            animate: { x: "0%", scaleY: 1, transition: { x: { repeat: Infinity, duration: 4.5, ease: "linear" } } },
            hover: { x: "0%", scaleY: 1.4, transition: { x: { repeat: Infinity, duration: 1.8, ease: "linear" }, scaleY: { type: "spring", stiffness: 300 } } },
            tap: { x: "0%", scaleY: 0.6, transition: { x: { repeat: Infinity, duration: 1.8, ease: "linear" } } }
          }}
        >
          <svg viewBox="0 0 800 50" preserveAspectRatio="none" className="w-full h-full">
            <path d="M 0 25 Q 100 15, 200 25 T 400 25 T 600 25 T 800 25 L 800 50 L 0 50 Z" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Front Wave (Moves Left faster) */}
        <motion.div 
          className="absolute left-0 w-[200%] -translate-y-[99%] text-foreground h-4 md:h-6"
          style={{ transformOrigin: "bottom" }}
          variants={{
            initial: { x: "0%", scaleY: 1 },
            animate: { x: "-50%", scaleY: 1, transition: { x: { repeat: Infinity, duration: 3, ease: "linear" } } },
            hover: { x: "-50%", scaleY: 1.3, transition: { x: { repeat: Infinity, duration: 1.2, ease: "linear" }, scaleY: { type: "spring", stiffness: 300 } } },
            tap: { x: "-50%", scaleY: 0.7, transition: { x: { repeat: Infinity, duration: 1.2, ease: "linear" } } }
          }}
        >
          <svg viewBox="0 0 800 50" preserveAspectRatio="none" className="w-full h-full">
            <path d="M 0 25 Q 100 5, 200 25 T 400 25 T 600 25 T 800 25 L 800 50 L 0 50 Z" fill="currentColor" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
