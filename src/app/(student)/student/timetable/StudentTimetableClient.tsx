"use client";

import { Clock, MapPin, User } from "lucide-react";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export function StudentTimetableClient({ timetables }: { timetables: any[] }) {
  // Assuming a student is enrolled in exactly one timetable for their current semester
  const activeTimetable = timetables[0];

  if (!activeTimetable) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/60 rounded-3xl">
        <p>Your timetable hasn't been published yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl p-6">
        <div className="min-w-[800px] flex gap-4">
          {DAYS.map(day => {
            const daySlots = activeTimetable.slots.filter((s: any) => s.dayOfWeek === day);
            
            return (
              <div key={day} className="flex-1 flex flex-col gap-3 min-w-[150px]">
                <h4 className="font-semibold text-center text-sm mb-2 text-gradient">{day}</h4>
                
                {daySlots.length === 0 ? (
                  <div className="h-24 flex items-center justify-center border border-dashed rounded-2xl border-white/10 text-muted-foreground text-xs">
                    No Classes
                  </div>
                ) : (
                  daySlots.map((slot: any) => (
                    <div key={slot.id} className="group p-4 rounded-2xl border-[0.3px] border-white/20 bg-background/50 hover:bg-background/80 hover:shadow-lg transition-all flex flex-col gap-2">
                      <p className="font-semibold text-sm leading-snug">{slot.subject.name}</p>
                      
                      <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-primary/70" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-blue-400/70" />
                          <span>{slot.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="w-3.5 h-3.5 text-emerald-400/70" />
                          <span className="truncate">{slot.teacher.user.name}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
