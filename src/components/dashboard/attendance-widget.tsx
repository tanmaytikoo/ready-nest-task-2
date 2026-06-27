import { AlertCircle } from "lucide-react";

export function AttendanceWidget() {
  const percentage = 82;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center mt-4 h-full">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Background Ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-muted/30"
          />
          {/* Progress Ring */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="flex flex-col items-center justify-center relative z-10">
          <span className="text-3xl font-bold tracking-tighter">{percentage}%</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Overall</span>
        </div>
      </div>
      
      <div className="mt-6 flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 w-full">
        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-orange-500">Low Attendance Warning</p>
          <p className="text-xs text-muted-foreground mt-0.5">You have 65% in Operating Systems. Don't miss the next class.</p>
        </div>
      </div>
    </div>
  );
}
