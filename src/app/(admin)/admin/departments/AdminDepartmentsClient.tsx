"use client";

import { useState } from "react";
import { Plus, Trash2, Layers, BookOpen, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDepartment, deleteDepartment, createCourse, createSemester, deleteCourse, deleteSemester } from "./actions";

export function AdminDepartmentsClient({ initialDepartments }: { initialDepartments: any[] }) {
  const [departments, setDepartments] = useState(initialDepartments);
  
  // States for Department creation
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: "", code: "" });

  // States for Course creation
  const [addingCourseTo, setAddingCourseTo] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({ name: "", code: "" });

  // States for Semester creation
  const [addingSemTo, setAddingSemTo] = useState<string | null>(null);
  const [semForm, setSemForm] = useState({ number: "" });

  async function handleCreateDept(e: React.FormEvent) {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) return;
    try {
      await createDepartment(deptForm.name, deptForm.code);
      window.location.reload();
    } catch (err: any) { alert(err.message); }
  }

  async function handleCreateCourse(e: React.FormEvent, deptId: string) {
    e.preventDefault();
    if (!courseForm.name || !courseForm.code) return;
    try {
      await createCourse(courseForm.name, courseForm.code, deptId);
      window.location.reload();
    } catch (err: any) { alert(err.message); }
  }

  async function handleCreateSem(e: React.FormEvent, courseId: string) {
    e.preventDefault();
    if (!semForm.number) return;
    try {
      await createSemester(parseInt(semForm.number), courseId);
      window.location.reload();
    } catch (err: any) { alert(err.message); }
  }

  async function handleDeleteDept(id: string) {
    if (!confirm("Are you sure? This deletes ALL courses, students, and teachers in this department!")) return;
    await deleteDepartment(id);
    window.location.reload();
  }

  async function handleDeleteCourse(id: string) {
    if (!confirm("Are you sure? This deletes ALL semesters, subjects, and students in this course!")) return;
    await deleteCourse(id);
    window.location.reload();
  }

  async function handleDeleteSemester(id: string) {
    if (!confirm("Are you sure you want to delete this semester?")) return;
    await deleteSemester(id);
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card/40 backdrop-blur-xl border-[0.3px] border-white/40 dark:border-white/10 p-4 rounded-3xl">
        <h2 className="text-xl font-bold">Departments Structure</h2>
        <Button onClick={() => setIsAddingDept(!isAddingDept)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Department
        </Button>
      </div>

      {isAddingDept && (
        <form onSubmit={handleCreateDept} className="p-5 rounded-3xl border-[0.3px] border-primary/50 bg-primary/5 backdrop-blur-xl flex flex-col gap-4">
          <h3 className="font-semibold text-primary">New Department</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input required placeholder="Name (e.g. Computer Science)" value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} className="bg-background/50 border-white/10" />
            <Input required placeholder="Code (e.g. CSE)" value={deptForm.code} onChange={e => setDeptForm({...deptForm, code: e.target.value.toUpperCase()})} className="bg-background/50 border-white/10" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsAddingDept(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {departments.length === 0 && (
          <div className="h-40 flex items-center justify-center text-muted-foreground border border-dashed rounded-3xl border-border/60">
            No departments found.
          </div>
        )}
        
        {departments.map((dept: any) => (
          <div key={dept.id} className="p-6 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-2xl text-primary"><Layers className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-xl font-bold">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{dept.code}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setAddingCourseTo(addingCourseTo === dept.id ? null : dept.id)}>Add Course</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteDept(dept.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>

            {addingCourseTo === dept.id && (
              <form onSubmit={e => handleCreateCourse(e, dept.id)} className="mb-6 p-4 rounded-2xl border-[0.3px] border-white/20 bg-background/50 flex gap-4 items-center">
                <Input required placeholder="Course Name (e.g. B.Tech)" value={courseForm.name} onChange={e => setCourseForm({...courseForm, name: e.target.value})} className="bg-background border-white/10" />
                <Input required placeholder="Course Code (e.g. BT)" value={courseForm.code} onChange={e => setCourseForm({...courseForm, code: e.target.value.toUpperCase()})} className="bg-background border-white/10" />
                <Button type="submit" size="sm">Add Course</Button>
              </form>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {dept.courses.map((course: any) => (
                <div key={course.id} className="p-4 rounded-2xl border-[0.3px] border-white/20 bg-background/50 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{course.name} <span className="text-muted-foreground text-xs ml-2">({course.code})</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setAddingSemTo(addingSemTo === course.id ? null : course.id)}>+ Semester</Button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  {addingSemTo === course.id && (
                    <form onSubmit={e => handleCreateSem(e, course.id)} className="flex gap-2 items-center p-2 border border-dashed border-white/20 rounded-xl">
                      <Input required type="number" min="1" max="10" placeholder="Sem Number (1-8)" value={semForm.number} onChange={e => setSemForm({number: e.target.value})} className="h-8 text-sm bg-background border-white/10" />
                      <Button type="submit" size="sm" className="h-8 text-xs">Add</Button>
                    </form>
                  )}

                  <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-white/5">
                    {course.semesters.sort((a:any, b:any) => a.number - b.number).map((sem: any) => (
                      <span key={sem.id} className="px-2.5 py-1 rounded-md bg-white/5 border-[0.3px] border-white/10 text-xs font-bold flex items-center gap-1.5 group pr-1.5">
                        <Clock className="w-3 h-3 text-primary" /> Sem {sem.number}
                        <button onClick={() => handleDeleteSemester(sem.id)} className="ml-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {course.semesters.length === 0 && <span className="text-xs text-muted-foreground italic">No semesters added.</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
