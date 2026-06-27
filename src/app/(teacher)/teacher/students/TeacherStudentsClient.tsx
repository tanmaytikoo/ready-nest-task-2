"use client";

import { useState } from "react";
import { Search, Filter, Mail, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TeacherStudentsClient({ students }: { students: any[] }) {
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("ALL");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const semesters = Array.from(new Set(students.map(s => s.semester))).sort();

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.enrollmentNo.toLowerCase().includes(search.toLowerCase());
    const matchesSemester = semesterFilter === "ALL" || s.semester === Number(semesterFilter);
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/40 backdrop-blur-xl border-[0.3px] border-white/40 dark:border-white/10 p-4 rounded-3xl">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or enrollment no..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50 border-white/10"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground hidden md:block" />
          <select 
            className="flex h-10 w-full md:w-auto rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="ALL">All Semesters</option>
            {semesters.map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/60 rounded-3xl">
            <p>No students found matching your criteria.</p>
          </div>
        ) : (
          filteredStudents.map(student => (
            <div key={student.id} className="group flex flex-col p-5 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl hover:shadow-xl transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl overflow-hidden shrink-0 border-[0.3px] border-white/20">
                  {student.avatar ? (
                    <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    student.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm line-clamp-1" title={student.name}>{student.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{student.enrollmentNo}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold px-2 py-1 bg-background/60 rounded-md text-foreground">
                  Sem {student.semester}
                </span>
                <span className="text-[10px] font-bold px-2 py-1 bg-background/60 rounded-md text-foreground line-clamp-1">
                  {student.department}
                </span>
              </div>
              
              <div className="mt-auto pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Attendance</span>
                  <span className={`text-xs font-bold ${student.attendancePercent < 75 ? 'text-red-500' : 'text-primary'}`}>{student.attendancePercent}%</span>
                </div>
                
                <button 
                  onClick={() => handleCopyEmail(student.email)} 
                  className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium bg-background/50 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors border-[0.3px] border-white/5 text-muted-foreground"
                >
                  {copiedEmail === student.email ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" /> <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5" /> Copy Email
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
