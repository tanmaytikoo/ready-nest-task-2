"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [meteors, setMeteors] = useState<
    {
      id: number;
      left: string;
      top: string;
      animationDelay: string;
      animationDuration: string;
    }[]
  >([]);

  useEffect(() => {
    const generateMeteors = () => {
      const newMeteors = new Array(number).fill(true).map((el, idx) => ({
        id: idx,
        left: Math.floor(Math.random() * 120) + "vw",
        top: Math.floor(Math.random() * 120) - 20 + "vh",
        animationDelay: Math.random() * (1.5 - 0.2) + 0.2 + "s",
        animationDuration: Math.floor(Math.random() * (12 - 4) + 4) + "s",
      }));
      setMeteors(newMeteors);
    };

    generateMeteors();
  }, [number]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className={cn(
            "animate-meteor-effect absolute h-0.5 w-0.5 rounded-[9999px] bg-neutral-500 dark:bg-slate-400 shadow-[0_0_0_1px_#00000010] dark:shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-neutral-500 dark:before:from-slate-400 before:to-transparent",
            className
          )}
          style={{
            top: meteor.top,
            left: meteor.left,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        ></span>
      ))}
    </div>
  );
};
