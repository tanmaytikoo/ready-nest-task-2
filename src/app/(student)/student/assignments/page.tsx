import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { StudentAssignmentsClient } from "./StudentAssignmentsClient";

export const metadata: Metadata = {
  title: "Assignments | Nova",
  description: "Official Teacher Assignments",
};

export default async function StudentAssignmentsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    include: {
      subjects: { select: { subjectId: true } }
    }
  });

  if (!student) return <div className="p-8 text-red-500">Student not found.</div>;

  const subjectIds = student.subjects.map(s => s.subjectId);

  // Fetch assignments for subjects the student is enrolled in
  const assignments = await db.assignment.findMany({
    where: { subjectId: { in: subjectIds } },
    include: {
      subject: { select: { name: true } },
      teacher: { include: { user: { select: { name: true } } } },
      submissions: {
        where: { studentId: student.id }
      }
    },
    orderBy: { deadline: 'asc' }
  });

  return (
    <div className="flex flex-col gap-6 relative z-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Course Assignments</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">View official assignments from your teachers.</p>
      </div>
      <StudentAssignmentsClient initialAssignments={assignments} studentId={student.id} />
    </div>
  );
}
