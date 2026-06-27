"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitAttendance } from "./actions";
import { Check, X, Clock, UserMinus, Save, Download } from "lucide-react";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export function TeacherAttendanceClient({ subjects }: { subjects: any[] }) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || "");
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSubject = subjects.find(s => s.id === selectedSubject);
  const students = currentSubject?.students || [];

  const handleMarkAll = (status: AttendanceStatus) => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    students.forEach((s: any) => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
  };

  const handleToggle = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSubject) return;
    
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status
    }));

    if (records.length === 0) {
      alert("Please mark attendance for at least one student.");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitAttendance(selectedSubject, new Date(date), records);
      alert("Attendance saved successfully!");
      setAttendance({});
    } catch (e: any) {
      alert(e.message || "Failed to save attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (!currentSubject) return;
    const headers = ["Name", "Enrollment No", "Status"];
    const rows = students.map((s: any) => [
      `"${s.name}"`,
      `"${s.enrollmentNo}"`,
      attendance[s.id] === 'PRESENT' ? 'Present' : 'Absent'
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map((r: string[]) => r.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${currentSubject.name}_Attendance_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 p-5 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl flex flex-col gap-2">
          <label className="text-xs text-muted-foreground ml-1">Select Subject</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-white/10"
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setAttendance({});
            }}
          >
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        
        <div className="flex-1 p-5 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl flex flex-col gap-2">
          <label className="text-xs text-muted-foreground ml-1">Date</label>
          <Input 
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-background/50 border-white/10"
          />
        </div>
      </div>

      {currentSubject && (
        <div className="p-5 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Mark Attendance</h3>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleMarkAll("PRESENT")} className="text-green-500 border-green-500/20 hover:bg-green-500/10"><Check className="w-4 h-4 mr-2" /> Check All Present</Button>
              <Button size="sm" variant="outline" onClick={() => handleMarkAll("ABSENT")} className="text-muted-foreground border-white/10 hover:bg-white/5"><X className="w-4 h-4 mr-2" /> Uncheck All</Button>
            </div>
          </div>

          <div className="space-y-2">
            {students.length === 0 ? (
              <p className="text-center text-muted-foreground py-8 border border-dashed rounded-2xl border-white/10">No students enrolled.</p>
            ) : (
              students.map((student: any) => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-2xl bg-background/50 border-[0.3px] border-white/10 hover:bg-accent/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.enrollmentNo}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleToggle(student.id, attendance[student.id] === 'PRESENT' ? 'ABSENT' : 'PRESENT')} 
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all border ${
                        attendance[student.id] === 'PRESENT' 
                          ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                          : 'bg-background/50 border-white/10 text-muted-foreground hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 ${
                        attendance[student.id] === 'PRESENT'
                          ? 'bg-green-500 border-green-500 text-white scale-110'
                          : 'border-muted-foreground bg-transparent'
                      }`}>
                        {attendance[student.id] === 'PRESENT' && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-medium w-16 text-left">
                        {attendance[student.id] === 'PRESENT' ? 'Present' : 'Absent'}
                      </span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={handleExportCSV} disabled={students.length === 0} className="border-white/10 hover:bg-white/5 gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || students.length === 0} className="bg-primary text-primary-foreground gap-2">
              <Save className="w-4 h-4" /> Save Attendance
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
