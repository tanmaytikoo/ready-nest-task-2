"use client";

import { useState } from "react";
import { Plus, Trash2, CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTimetableSlot, deleteTimetableSlot } from "./actions";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

export function TeacherTimetableClient({ timetables, mySubjects, teacherId }: { timetables: any[], mySubjects: any[], teacherId: string }) {
  const [selectedTimetable, setSelectedTimetable] = useState(timetables[0]?.id || "");
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: "MONDAY" as any,
    startTime: "09:00",
    endTime: "10:00",
    room: "",
    subjectId: mySubjects[0]?.id || "",
  });

  const activeTimetable = timetables.find(t => t.id === selectedTimetable);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.room || !formData.subjectId || !selectedTimetable) return;

    try {
      await createTimetableSlot({
        ...formData,
        timetableId: selectedTimetable
      });
      window.location.reload(); 
    } catch (error: any) {
      alert(error.message || "Failed to create slot (Conflict detected?)");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    await deleteTimetableSlot(id);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card/40 backdrop-blur-xl border-[0.3px] border-white/40 dark:border-white/10 p-4 rounded-3xl">
        <div className="flex flex-col gap-1 w-full max-w-sm">
          <label className="text-xs text-muted-foreground ml-1">Select Timetable / Class</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10"
            value={selectedTimetable}
            onChange={(e) => setSelectedTimetable(e.target.value)}
          >
            {timetables.map(t => (
              <option key={t.id} value={t.id}>
                {t.semester.course.name} - Sem {t.semester.number}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Slot
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl flex flex-col gap-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Day</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10"
                value={formData.dayOfWeek}
                onChange={e => setFormData({...formData, dayOfWeek: e.target.value as any})}
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Start Time</label>
              <Input 
                required 
                type="time"
                value={formData.startTime} 
                onChange={e => setFormData({...formData, startTime: e.target.value})} 
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">End Time</label>
              <Input 
                required 
                type="time"
                value={formData.endTime} 
                onChange={e => setFormData({...formData, endTime: e.target.value})} 
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Subject</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10"
                value={formData.subjectId}
                onChange={e => setFormData({...formData, subjectId: e.target.value})}
              >
                {mySubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Room</label>
              <Input 
                required 
                placeholder="e.g. Lab 2" 
                value={formData.room} 
                onChange={e => setFormData({...formData, room: e.target.value})} 
                className="bg-background/50 border-white/10"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button type="submit">Save Slot</Button>
          </div>
        </form>
      )}

      {activeTimetable && (
        <div className="overflow-x-auto rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl p-6">
          <div className="min-w-[800px] flex gap-4">
            {DAYS.slice(0, 5).map(day => {
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
                      <div key={slot.id} className="group relative p-3 rounded-2xl border-[0.3px] border-white/20 bg-background/50 hover:bg-background/80 transition-all flex flex-col gap-1.5 shadow-sm">
                        {slot.teacherId === teacherId && (
                          <button 
                            onClick={() => handleDelete(slot.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all bg-background/80 p-1 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <p className="font-semibold text-sm leading-snug truncate pr-6">{slot.subject.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{slot.startTime} - {slot.endTime}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md">{slot.room}</span>
                          <span className="text-[10px] text-muted-foreground">{slot.teacher.user.name}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
