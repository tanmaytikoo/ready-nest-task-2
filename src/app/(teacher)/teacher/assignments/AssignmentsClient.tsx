"use client";

import { useState } from "react";
import { Plus, Trash2, CalendarIcon, Users, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";
import { createAssignment, deleteAssignment } from "./actions";

export function AssignmentsClient({ initialAssignments, subjects }: { initialAssignments: any[], subjects: any[] }) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    subjectId: subjects[0]?.id || "",
    priority: "NORMAL",
    attachments: [] as { url: string; name: string }[],
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.subjectId || !formData.deadline) return;

    try {
      const res = await createAssignment({
        ...formData,
        deadline: new Date(formData.deadline),
        attachments: formData.attachments.length > 0 ? JSON.stringify(formData.attachments) : undefined,
      });
      // Simple optimistic or just refresh
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Failed to create assignment");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    await deleteAssignment(id);
    setAssignments(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">All Assignments</h2>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Create Assignment
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Title</label>
              <Input 
                required 
                placeholder="Assignment Title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Subject</label>
              <select 
                required
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-white/10"
                value={formData.subjectId}
                onChange={e => setFormData({...formData, subjectId: e.target.value})}
              >
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Deadline</label>
              <Input 
                required 
                type="date"
                value={formData.deadline} 
                onChange={e => setFormData({...formData, deadline: e.target.value})} 
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Priority</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground ml-1">Description</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-white/10"
              placeholder="Detailed description..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground ml-1">Attachments (PDFs)</label>
            <div className="bg-background/50 border border-white/10 rounded-md p-4">
              <UploadDropzone
                endpoint="pdfUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const newFiles = res.map(f => ({ url: f.url, name: f.name }));
                    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newFiles] }));
                  }
                  alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                  container: "border-zinc-500/20 bg-zinc-500/5 hover:bg-zinc-500/10 transition-colors rounded-xl border-dashed border-2 p-4 w-full mt-2",
                  uploadIcon: "text-zinc-900 dark:text-zinc-100 w-6 h-6 mb-1 drop-shadow-sm",
                  label: "text-zinc-900 dark:text-zinc-100 font-semibold text-xs",
                  allowedContent: "text-zinc-500 dark:text-zinc-400 text-[10px] mt-1",
                  button: "!bg-zinc-900 dark:!bg-zinc-100 !text-zinc-100 dark:!text-zinc-900 rounded-lg mt-3 text-[10px] font-bold px-4 py-1.5 hover:!bg-zinc-800 dark:hover:!bg-zinc-200 transition-all after:!bg-zinc-900/50 dark:after:!bg-zinc-100/50",
                }}
              />
              {formData.attachments.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {formData.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm p-2 rounded-md bg-white/5">
                      <FileIcon className="w-4 h-4 text-primary" />
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button type="submit">Save Assignment</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-4 pb-8">
        {assignments.length === 0 && !isAdding && (
          <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/60 rounded-3xl">
            <p>No assignments created yet.</p>
          </div>
        )}
        
        {assignments.map(assignment => (
          <div key={assignment.id} className="group flex flex-col rounded-3xl overflow-hidden border border-white/20 bg-card/60 backdrop-blur-xl hover:shadow-xl transition-all shadow-lg shadow-black/5">
            <div className="flex flex-col flex-1 p-5">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-lg text-foreground">{assignment.title}</h3>
                <button 
                  onClick={() => handleDelete(assignment.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-500 transition-all rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="text-[10px] font-medium px-2 py-0.5 bg-background/60 rounded-md text-foreground">
                  {assignment.subject.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider ${assignment.priority === 'HIGH' ? 'bg-red-500/10 text-red-500' : assignment.priority === 'NORMAL' ? 'bg-blue-500/10 text-blue-500' : 'bg-neutral-500/10 text-neutral-500'}`}>
                  {assignment.priority}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {new Date(assignment.deadline).toISOString().split('T')[0]}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  {assignment._count?.submissions || 0}
                </div>
              </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{assignment.description || "No description provided."}</p>
            
            {assignment.attachments && (
              <div className="flex flex-col gap-2 mb-4">
                {JSON.parse(assignment.attachments).map((file: any, i: number) => (
                  <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/10 w-fit">
                    <FileIcon className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                  </a>
                ))}
              </div>
            )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
