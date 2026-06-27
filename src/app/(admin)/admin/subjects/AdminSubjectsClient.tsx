"use client";

import { useState } from "react";
import { Plus, Trash2, BookOpen, Users, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSubject, deleteSubject, assignTeacherToSubject, removeTeacherFromSubject } from "./actions";

export function AdminSubjectsClient({ initialSubjects, courses, teachers }: { initialSubjects: any[], courses: any[], teachers: any[] }) {
  const [subjects, setSubjects] = useState(initialSubjects);
  
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [subjectForm, setSubjectForm] = useState({ name: "", code: "", courseId: courses[0]?.id || "", semesterId: "" });

  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || "");

  const selectedCourse = courses.find((c: any) => c.id === subjectForm.courseId);

  async function handleCreateSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.code || !subjectForm.courseId || !subjectForm.semesterId) return;
    try {
      await createSubject(subjectForm.name, subjectForm.code, subjectForm.courseId, subjectForm.semesterId);
      window.location.reload();
    } catch (err: any) { alert(err.message); }
  }

  async function handleDeleteSubject(id: string) {
    if (!confirm("Delete subject? This removes all related data including assignments and attendance.")) return;
    await deleteSubject(id);
    window.location.reload();
  }

  async function handleAssignTeacher(e: React.FormEvent, subjectId: string) {
    e.preventDefault();
    try {
      await assignTeacherToSubject(selectedTeacherId, subjectId);
      window.location.reload();
    } catch (err: any) { alert(err.message); }
  }

  async function handleRemoveTeacher(teacherId: string, subjectId: string) {
    if (!confirm("Remove teacher from this subject?")) return;
    try {
      await removeTeacherFromSubject(teacherId, subjectId);
      window.location.reload();
    } catch (err: any) { alert(err.message); }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card/40 backdrop-blur-xl border-[0.3px] border-white/40 dark:border-white/10 p-4 rounded-3xl">
        <h2 className="text-xl font-bold">Subjects Management</h2>
        <Button onClick={() => setIsAddingSubject(!isAddingSubject)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Subject
        </Button>
      </div>

      {isAddingSubject && (
        <form onSubmit={handleCreateSubject} className="p-5 rounded-3xl border-[0.3px] border-primary/50 bg-primary/5 backdrop-blur-xl flex flex-col gap-4">
          <h3 className="font-semibold text-primary">New Subject</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Input required placeholder="Name (e.g. Data Structures)" value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} className="bg-background/50 border-white/10" />
            <Input required placeholder="Code (e.g. CS201)" value={subjectForm.code} onChange={e => setSubjectForm({...subjectForm, code: e.target.value.toUpperCase()})} className="bg-background/50 border-white/10" />
            
            <select 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10"
              value={subjectForm.courseId}
              onChange={e => setSubjectForm({...subjectForm, courseId: e.target.value, semesterId: ""})}
            >
              <option value="" disabled>Select Course</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10"
              value={subjectForm.semesterId}
              onChange={e => setSubjectForm({...subjectForm, semesterId: e.target.value})}
            >
              <option value="" disabled>Select Semester</option>
              {selectedCourse?.semesters.map((s: any) => <option key={s.id} value={s.id}>Semester {s.number}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddingSubject(false)}>Cancel</Button>
            <Button type="submit">Create Subject</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjects.length === 0 && (
          <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground border border-dashed rounded-3xl border-border/60">
            No subjects found.
          </div>
        )}
        
        {subjects.map((subject: any) => (
          <div key={subject.id} className="p-5 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/20 rounded-xl text-primary"><BookOpen className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold leading-tight">{subject.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{subject.code} • Sem {subject.semester.number}</p>
                </div>
              </div>
              <button onClick={() => handleDeleteSubject(subject.id)} className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-red-500 transition-opacity bg-background/50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Assigned Teachers</h4>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]" onClick={() => setAssigningTo(assigningTo === subject.id ? null : subject.id)}>
                  <UserPlus className="w-3 h-3 mr-1" /> Assign
                </Button>
              </div>

              {assigningTo === subject.id && (
                <form onSubmit={e => handleAssignTeacher(e, subject.id)} className="flex gap-2">
                  <select 
                    required
                    className="flex h-8 w-full rounded-md border border-input bg-background/50 px-2 py-1 text-xs ring-offset-background border-white/10"
                    value={selectedTeacherId}
                    onChange={e => setSelectedTeacherId(e.target.value)}
                  >
                    {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.user.name}</option>)}
                  </select>
                  <Button type="submit" size="sm" className="h-8 px-2">Add</Button>
                </form>
              )}

              <div className="flex flex-col gap-1.5">
                {subject.teachers.length === 0 ? (
                  <span className="text-xs text-muted-foreground italic">No teachers assigned.</span>
                ) : (
                  subject.teachers.map((ts: any) => (
                    <div key={ts.teacherId} className="flex justify-between items-center bg-background/50 border-[0.3px] border-white/10 p-1.5 rounded-md text-xs">
                      <span className="font-medium px-1 truncate">{ts.teacher.user.name}</span>
                      <button onClick={() => handleRemoveTeacher(ts.teacherId, subject.id)} className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded text-muted-foreground transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
