import { Metadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NotesClient } from "./NotesClient";

export const metadata: Metadata = {
  title: "Notes | Nova",
  description: "Rich Text Academic Notes",
};

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    include: {
      subjects: {
        include: { subject: true }
      }
    }
  });

  if (!student) {
    return <div className="p-8 text-destructive">Student profile not found.</div>;
  }

  const notes = await db.note.findMany({
    where: { studentId: student.id },
    orderBy: { updatedAt: "desc" },
  });

  const subjects = student.subjects.map(s => ({
    id: s.subject.id,
    name: s.subject.name
  }));

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Notes</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Write, tag, and organize your class notes.</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <NotesClient initialNotes={notes} subjects={subjects} />
      </div>
    </div>
  );
}
