"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Bold, Italic, List, Heading2, Paperclip, FileIcon } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

type Subject = { id: string; name: string };
type Note = { id: string; title: string; content: string; subjectId: string | null; attachments: string | null };

export function NoteEditor({
  note,
  subjects,
  onSave,
  onDelete,
}: {
  note: Note | null;
  subjects: Subject[];
  onSave: (id: string | null, title: string, content: string, subjectId: string | null, attachments: string | null) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(note?.title || "");
  const [subjectId, setSubjectId] = useState(note?.subjectId || "");
  const [attachments, setAttachments] = useState<{url: string, name: string}[]>(
    note?.attachments ? JSON.parse(note.attachments) : []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[400px]",
      },
    },
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setSubjectId(note.subjectId || "");
      setAttachments(note.attachments ? JSON.parse(note.attachments) : []);
      if (editor && editor.getHTML() !== note.content) {
        editor.commands.setContent(note.content);
      }
    } else {
      setTitle("");
      setSubjectId("");
      setAttachments([]);
      editor?.commands.setContent("");
    }
  }, [note, editor]);

  const handleSave = async () => {
    if (!title.trim() || !editor) return;
    setIsSaving(true);
    try {
      await onSave(note?.id || null, title, editor.getHTML(), subjectId || null, attachments.length > 0 ? JSON.stringify(attachments) : null);
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full rounded-3xl border-[0.3px] border-white/40 dark:border-2 dark:border-white/10 bg-neutral-200/80 dark:bg-card backdrop-blur-xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/50">
        <div className="flex gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg transition-colors ${editor.isActive("bold") ? "bg-primary/20 text-primary" : "hover:bg-accent text-muted-foreground"}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg transition-colors ${editor.isActive("italic") ? "bg-primary/20 text-primary" : "hover:bg-accent text-muted-foreground"}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg transition-colors ${editor.isActive("heading") ? "bg-primary/20 text-primary" : "hover:bg-accent text-muted-foreground"}`}
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg transition-colors ${editor.isActive("bulletList") ? "bg-primary/20 text-primary" : "hover:bg-accent text-muted-foreground"}`}
          >
            <List className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-border/50 mx-1 self-center" />
          <button
            onClick={() => setShowUpload(!showUpload)}
            className={`p-2 rounded-lg transition-colors ${showUpload ? "bg-primary/20 text-primary" : "hover:bg-accent text-muted-foreground"}`}
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          {note && onDelete && (
            <Button variant="outline" size="icon" onClick={() => onDelete(note.id)} className="text-destructive hover:bg-destructive/10 border-destructive/20">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving || !title.trim()} className="rounded-xl px-6 bg-primary text-primary-foreground">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-foreground"
          />
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="p-2 rounded-xl bg-background border border-border/50 text-sm outline-none focus:border-primary text-foreground"
          >
            <option value="">No Subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 cursor-text flex flex-col h-full" onClick={() => editor.commands.focus()}>
          {showUpload && (
            <div className="mb-4 bg-background/50 border border-white/10 rounded-md p-4">
              <UploadDropzone
                endpoint="pdfUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const newFiles = res.map(f => ({ url: f.url, name: f.name }));
                    setAttachments(prev => [...prev, ...newFiles]);
                  }
                  alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
                appearance={{
                  container: "border-zinc-500/20 bg-zinc-500/5 hover:bg-zinc-500/10 transition-colors rounded-2xl border-dashed border-2 p-6 w-full mt-2",
                  uploadIcon: "text-zinc-900 dark:text-zinc-100 w-8 h-8 mb-2 drop-shadow-sm",
                  label: "text-zinc-900 dark:text-zinc-100 font-semibold text-sm",
                  allowedContent: "text-zinc-500 dark:text-zinc-400 text-xs mt-1",
                  button: "!bg-zinc-900 dark:!bg-zinc-100 !text-zinc-100 dark:!text-zinc-900 rounded-xl mt-4 text-xs font-bold px-6 py-2 hover:!bg-zinc-800 dark:hover:!bg-zinc-200 transition-all after:!bg-zinc-900/50 dark:after:!bg-zinc-100/50",
                }}
              />
            </div>
          )}

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {attachments.map((file, i) => (
                <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/10 w-fit">
                  <FileIcon className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </a>
              ))}
            </div>
          )}

          <EditorContent editor={editor} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
