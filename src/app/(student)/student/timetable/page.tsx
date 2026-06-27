import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { StudentTimetableClient } from "./StudentTimetableClient";

export const metadata: Metadata = {
  title: "Timetable | Nova",
  description: "Your weekly class schedule",
};

export default async function StudentTimetablePage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 text-muted-foreground">Loading session...</div>;
  }

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) {
    return <div className="p-8 text-red-500">Student profile not found.</div>;
  }

  const timetables = await db.timetable.findMany({
    where: {
      departmentId: student.departmentId,
      semesterId: student.semesterId,
    },
    include: {
      slots: {
        include: {
          subject: true,
          teacher: { include: { user: true } },
        },
        orderBy: { startTime: 'asc' },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6 relative z-10 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Weekly Timetable</h1>
        <p className="text-muted-foreground mt-1 text-sm font-normal">View your class schedule and locations.</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <StudentTimetableClient timetables={timetables} />
      </div>
    </div>
  );
}
