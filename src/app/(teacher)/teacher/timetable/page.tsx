import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { TeacherTimetableClient } from "./TeacherTimetableClient";

export const metadata: Metadata = {
  title: "Timetable | Nova",
  description: "Timetable Management",
};

export default async function TeacherTimetablePage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id },
    include: {
      department: {
        include: {
          timetables: {
            include: {
              semester: {
                include: { course: true }
              },
              slots: {
                include: {
                  subject: true,
                  teacher: { include: { user: true } }
                },
                orderBy: { startTime: 'asc' }
              }
            }
          }
        }
      },
      subjects: {
        include: { subject: true }
      }
    }
  });

  if (!teacher) {
    return <div className="p-8 text-red-500">Teacher profile not found.</div>;
  }

  return (
    <div className="flex flex-col gap-6 relative z-10 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Timetable Management</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">Manage class schedules and detect conflicts.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <TeacherTimetableClient 
          timetables={teacher.department.timetables} 
          mySubjects={teacher.subjects.map(s => s.subject)}
          teacherId={teacher.id}
        />
      </div>
    </div>
  );
}
