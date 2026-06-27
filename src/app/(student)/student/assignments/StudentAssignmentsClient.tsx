"use client";

import { useState } from "react";
import { CalendarIcon, User, FileIcon, CheckCircle2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { submitAssignment } from "./actions";

export function StudentAssignmentsClient({ initialAssignments, studentId }: { initialAssignments: any[], studentId: string }) {
  const [assignments, setAssignments] = useState(initialAssignments);

  return (
    <div className="flex flex-wrap gap-5 pb-8">
      {assignments.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed border-border/60 rounded-3xl">
          <p>No assignments due right now. Enjoy your free time!</p>
        </div>
      )}

      {assignments.map(assignment => {
        const isSubmitted = assignment.submissions?.length > 0;
        
        return (
          <div 
            key={assignment.id} 
            className={`flex flex-col w-[400px] h-[430px] shrink-0 rounded-3xl border transition-all hover:shadow-xl relative group overflow-hidden ${
              isSubmitted ? 'bg-card/40 border-white/10 opacity-70 hover:opacity-100' : 'bg-card/60 border-white/20 shadow-lg shadow-black/5'
            } backdrop-blur-xl`}
          >
            <div className="flex flex-col flex-1 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="flex justify-between items-start mb-2 shrink-0">
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex justify-between items-center w-full">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider bg-background/60 text-foreground">
                    {assignment.subject.name}
                  </span>
                  {isSubmitted && (
                    <span className="flex items-center gap-1 text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> Submitted
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-foreground mt-1">
                  {assignment.title}
                </h3>
                
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="w-3.5 h-3.5" /> {assignment.teacher.user.name}
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${!isSubmitted && new Date(assignment.deadline) < new Date() ? 'text-red-400' : 'text-foreground/60'}`}>
                    <CalendarIcon className="w-3.5 h-3.5" /> {new Date(assignment.deadline).toISOString().split('T')[0]}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {assignment.description || "No description provided."}
            </p>

            {assignment.attachments && (
              <div className="flex flex-col gap-1.5 mb-3">
                <span className="text-xs font-semibold text-foreground">Teacher Attachments:</span>
                {JSON.parse(assignment.attachments).map((file: any, i: number) => (
                  <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/10 w-fit">
                    <FileIcon className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                  </a>
                ))}
              </div>
            )}

            {!isSubmitted ? (
              <div className="mb-2">
                <h4 className="text-xs font-semibold mb-1.5 flex items-center gap-1.5"><UploadCloud className="w-3.5 h-3.5"/> Submit (PDF max 32MB)</h4>
                <div className="bg-background/50 border border-white/10 rounded-xl p-1.5">
                  <UploadDropzone
                    endpoint="pdfUploader"
                    onClientUploadComplete={async (res) => {
                      if (res) {
                        const attachments = res.map(f => ({ name: f.name, url: f.url }));
                        await submitAssignment(assignment.id, attachments);
                        alert("Assignment submitted successfully!");
                        window.location.reload();
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`ERROR! ${error.message}`);
                    }}
                    appearance={{
                      container: "border-zinc-500/20 bg-zinc-500/5 hover:bg-zinc-500/10 transition-colors rounded-lg border-dashed border p-3 w-full",
                      uploadIcon: "text-zinc-900 dark:text-zinc-100 w-5 h-5 mb-1 drop-shadow-sm",
                      label: "text-zinc-900 dark:text-zinc-100 font-semibold text-xs",
                      allowedContent: "text-zinc-500 dark:text-zinc-400 text-[9px] mt-0.5",
                      button: "!bg-zinc-900 dark:!bg-zinc-100 !text-zinc-100 dark:!text-zinc-900 rounded-md mt-2 text-[10px] font-bold px-3 py-1 hover:!bg-zinc-800 dark:hover:!bg-zinc-200 transition-all",
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-2 p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
                <h4 className="text-xs font-semibold text-green-500 mb-2">Your Submission:</h4>
                <div className="flex flex-col gap-2">
                  {assignment.submissions[0].attachments && JSON.parse(assignment.submissions[0].attachments).map((file: any, i: number) => (
                    <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs p-2 rounded-md bg-background/50 border border-white/5 w-fit hover:bg-white/5 transition-colors">
                      <FileIcon className="w-3.5 h-3.5 text-green-500" />
                      <span className="truncate max-w-[150px] text-foreground">{file.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    })}
    </div>
  );
}
