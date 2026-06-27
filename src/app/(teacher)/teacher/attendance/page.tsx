import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { TeacherAttendanceClient } from "./TeacherAttendanceClient";

export const metadata: Metadata = {
  title: "Mark Attendance | Nova",
  description: "Manage class attendance",
};

export default async function TeacherAttendancePage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
    include: {
      subjects: {
        include: {
          subject: {
            include: {
              students: {
                include: {
                  student: {
                    include: { user: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!teacher) {
    return <div className="p-8 text-red-500">Teacher profile not found.</div>;
  }

  // Format subjects and their enrolled students
  const subjectsWithStudents = teacher.subjects.map(ts => ({
    id: ts.subject.id,
    name: ts.subject.name,
    students: ts.subject.students.map(ss => ({
      id: ss.student.id,
      name: ss.student.user.name,
      enrollmentNo: ss.student.enrollmentNo,
    }))
  }));

  return (
    <div className="flex flex-col gap-6 relative z-10 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Attendance Management</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Mark attendance and generate reports.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <TeacherAttendanceClient subjects={subjectsWithStudents} />
      </div>
    </div>
  );
}
