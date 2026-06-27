import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { AssignmentsClient } from "./AssignmentsClient";

export const metadata: Metadata = {
  title: "Assignments | Nova",
  description: "Manage class assignments",
};

export default async function TeacherAssignmentsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
    include: {
      subjects: {
        include: { subject: true }
      }
    }
  });

  if (!teacher) {
    return <div className="p-8 text-red-500">Teacher profile not found.</div>;
  }

  const assignments = await db.assignment.findMany({
    where: { teacherId: teacher.id },
    include: {
      subject: true,
      _count: {
        select: { submissions: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  const subjects = teacher.subjects.map(ts => ts.subject);

  return (
    <div className="flex flex-col gap-6 relative z-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Teacher Assignments</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Manage your assignments and track submissions.</p>
      </div>
      <AssignmentsClient initialAssignments={assignments} subjects={teacher.subjects.map(ts => ts.subject)} />
    </div>
  );
}
