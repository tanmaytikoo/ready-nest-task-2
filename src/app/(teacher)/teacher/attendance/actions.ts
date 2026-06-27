"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function getTeacher() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id }
  });
  if (!teacher) throw new Error("Teacher not found");
  return teacher;
}

export async function submitAttendance(subjectId: string, date: Date, records: { studentId: string; status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" }[]) {
  const teacher = await getTeacher();

  // Verify teacher teaches subject
  const teaches = await db.teacherSubject.findFirst({
    where: { teacherId: teacher.id, subjectId }
  });
  if (!teaches) throw new Error("Unauthorized");

  // Create attendance record
  const attendance = await db.attendance.create({
    data: {
      date,
      subjectId,
      teacherId: teacher.id,
      records: {
        create: records.map(r => ({
          studentId: r.studentId,
          status: r.status,
        }))
      }
    }
  });

  revalidatePath("/teacher/attendance");
  revalidatePath("/student/attendance");
  revalidatePath("/student/dashboard");
  
  return attendance;
}
