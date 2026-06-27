"use client";

import { useState } from "react";
import { Plus, Trash2, Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNotice, deleteNotice, togglePinNotice } from "./actions";

export function TeacherNoticeClient({ initialNotices }: { initialNotices: any[] }) {
  const [notices, setNotices] = useState(initialNotices);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "ACADEMIC" as any,
    pinned: false,
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      const res = await createNotice(formData);
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Failed to create notice");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    await deleteNotice(id);
    setNotices(prev => prev.filter(n => n.id !== id));
  }

  async function handleTogglePin(id: string, currentPinned: boolean) {
    await togglePinNotice(id, !currentPinned);
    setNotices(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, pinned: !currentPinned } : n);
      return updated.sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">All Notices</h2>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Create Notice
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 rounded-3xl border-[0.3px] border-white/40 dark:border-white/10 bg-card/40 backdrop-blur-xl flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Title</label>
              <Input 
                required 
                placeholder="Notice Title" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground ml-1">Category</label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background border-white/10"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as any})}
              >
                <option value="ACADEMIC">Academic</option>
                <option value="EVENTS">Events</option>
                <option value="EXAMS">Exams</option>
                <option value="DEPARTMENT">Department</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground ml-1">Content</label>
            <textarea 
              required
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-white/10"
              placeholder="Notice content..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>
          <div className="flex items-center gap-2 ml-1">
            <input 
              type="checkbox" 
              id="pinned"
              checked={formData.pinned}
              onChange={e => setFormData({...formData, pinned: e.target.checked})}
              className="rounded bg-background/50 border-white/10"
            />
            <label htmlFor="pinned" className="text-sm">Pin to top</label>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button type="submit">Post Notice</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {notices.length === 0 && !isAdding && (
          <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/60 rounded-3xl">
            <p>No notices created yet.</p>
          </div>
        )}
        
        {notices.map(notice => (
          <div key={notice.id} className={`group flex flex-col p-5 rounded-3xl border-[0.3px] bg-card/40 backdrop-blur-xl hover:shadow-xl transition-all ${notice.pinned ? 'border-primary/50' : 'border-white/40 dark:border-white/10'}`}>
            <div className="flex justify-between items-start mb-2 gap-2">
              <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                {notice.pinned && <Pin className="w-4 h-4 text-primary fill-primary/20" />}
                {notice.title}
              </h3>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleTogglePin(notice.id, notice.pinned)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-primary/10"
                >
                  {notice.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => handleDelete(notice.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-red-500 transition-all rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4 flex-1">{notice.content}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider ${notice.category === 'EMERGENCY' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                {notice.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(notice.createdAt).toISOString().split('T')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
