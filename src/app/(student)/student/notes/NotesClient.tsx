"use client";

import { useState } from "react";
import { NoteEditor } from "@/components/student/NoteEditor";
import { createNote, updateNote, deleteNote } from "./actions";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText } from "lucide-react";

type Subject = { id: string; name: string };
type Note = { id: string; title: string; content: string; subjectId: string | null; updatedAt: Date; attachments: string | null };

export function NotesClient({
  initialNotes,
  subjects,
}: {
  initialNotes: Note[];
  subjects: Subject[];
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (id: string | null, title: string, content: string, subjectId: string | null, attachments: string | null) => {
    if (id) {
      const updated = await updateNote(id, title, content, subjectId, attachments);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } else {
      const created = await createNote(title, content, subjectId, attachments);
      setNotes((prev) => [created, ...prev]);
      setActiveNoteId(created.id);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Sidebar */}
      <div className={`w-full lg:w-80 flex-col gap-4 ${activeNoteId ? 'hidden lg:flex' : 'flex'}`}>
        <Button
          onClick={() => setActiveNoteId('new')}
          className="w-full justify-start rounded-2xl bg-primary text-primary-foreground h-12 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" /> New Note
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 rounded-2xl bg-card border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 text-sm outline-none focus:border-primary backdrop-blur-xl"
          />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 no-scrollbar pb-4">
          {filteredNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center mt-4">No notes found.</p>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-4 rounded-2xl text-left border-[0.3px] transition-all ${
                  activeNoteId === note.id
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card border-white/40 dark:border-white/10 hover:bg-accent/50"
                } backdrop-blur-xl group`}
              >
                <div className="font-semibold text-foreground flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span className="truncate">{note.title}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(note.updatedAt).toISOString().split('T')[0]}
                  </p>
                  {note.subjectId && (
                    <span className="text-[10px] font-medium px-2 py-0.5 bg-muted rounded-md text-foreground truncate max-w-[100px]">
                      {subjects.find(s => s.id === note.subjectId)?.name || 'Subject'}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className={`flex-1 relative z-10 flex-col h-full ${!activeNoteId ? 'hidden lg:flex' : 'flex'}`}>
        <button 
          onClick={() => setActiveNoteId(null)}
          className="lg:hidden mb-4 self-start text-sm text-primary font-medium flex items-center gap-2 bg-primary/10 hover:bg-primary/20 transition-colors px-4 py-2 rounded-xl"
        >
          ← Back to Notes
        </button>
        <div className="flex-1 min-h-[500px]">
          <NoteEditor
          key={activeNoteId || "new"}
          note={activeNote}
          subjects={subjects}
          onSave={handleSave}
          onDelete={handleDelete}
        />
        </div>
      </div>
    </div>
  );
}
