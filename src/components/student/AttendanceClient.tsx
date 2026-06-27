"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { LiquidFill } from "@/components/student/LiquidFill";

type SubjectAttendance = {
  subjectId: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
};

export function AttendanceClient({ subjects }: { subjects: SubjectAttendance[] }) {
  const [target, setTarget] = useState(75);

  const getPredictorMessage = (attended: number, total: number) => {
    if (total === 0) return { message: "No classes held yet.", type: "neutral" };
    
    const targetFraction = target / 100;
    const currentFraction = attended / total;

    if (currentFraction < targetFraction) {
      // (attended + X) / (total + X) = targetFraction
      // attended + X = targetFraction*total + targetFraction*X
      // X*(1 - targetFraction) = targetFraction*total - attended
      const req = Math.ceil((targetFraction * total - attended) / (1 - targetFraction));
      return {
        message: `Attend next ${req} class${req > 1 ? 'es' : ''} to reach ${target}%.`,
        type: "danger"
      };
    } else {
      // attended / (total + Y) = targetFraction
      // Y = (attended / targetFraction) - total
      const afford = Math.floor((attended / targetFraction) - total);
      if (afford === 0) {
        return { message: `On track. Don't miss the next class.`, type: "warning" };
      }
      return {
        message: `You can safely miss ${afford} class${afford > 1 ? 'es' : ''}.`,
        type: "safe"
      };
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-4 bg-card border-[0.3px] border-white/40 dark:border-white/10 backdrop-blur-xl p-4 rounded-2xl w-full max-w-sm">
        <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Target Percentage:</label>
        <div className="flex items-center gap-4 w-full">
          <input
            type="range"
            min="50"
            max="100"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="flex-1 appearance-none bg-primary/20 h-2.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:bg-[url('/logo-transparent.png')] [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:drop-shadow-lg [&::-webkit-slider-thumb]:[filter:brightness(0)] dark:[&::-webkit-slider-thumb]:[filter:brightness(1)] [&::-moz-range-thumb]:w-10 [&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:bg-[url('/logo-transparent.png')] [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:drop-shadow-lg [&::-moz-range-thumb]:[filter:brightness(0)] dark:[&::-moz-range-thumb]:[filter:brightness(1)] transition-all"
          />
          <span className="font-bold text-foreground w-12 text-right">{target}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub) => {
          const prediction = getPredictorMessage(sub.attended, sub.total);
          
          return (
            <div key={sub.subjectId} className="rounded-3xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 bg-card backdrop-blur-xl overflow-hidden flex flex-col group hover:shadow-xl transition-all">
              <div className="p-6 pb-4">
                <h3 className="font-semibold text-lg text-foreground truncate">{sub.subjectName}</h3>
                <div className="mt-4 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold text-gradient">{sub.percentage}%</span>
                    <span className="text-xs text-muted-foreground mt-1">{sub.attended} / {sub.total} Classes</span>
                  </div>
                  
                  <div className="relative">
                    <LiquidFill percentage={sub.percentage} size={64} />
                  </div>
                </div>
              </div>
              
              <div className={`mt-auto p-4 flex items-start gap-3 border-t border-border/40 ${prediction.type === 'danger' ? 'bg-destructive/10' : prediction.type === 'warning' ? 'bg-yellow-500/10' : 'bg-primary/10'}`}>
                {prediction.type === 'safe' ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-primary" />
                ) : (
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${prediction.type === 'danger' ? 'text-destructive' : 'text-yellow-500'}`} />
                )}
                <p className={`text-sm font-medium ${prediction.type === 'danger' ? 'text-destructive' : prediction.type === 'warning' ? 'text-yellow-600 dark:text-yellow-500' : 'text-primary'}`}>
                  {prediction.message}
                </p>
              </div>
            </div>
          );
        })}
        {subjects.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground border border-dashed rounded-3xl">
            No enrolled subjects or attendance records found.
          </div>
        )}
      </div>
    </div>
  );
}
