"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { DayOfWeek } from "@prisma/client";

async function getTeacher() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const teacher = await db.teacher.findUnique({
    where: { userId: session.user.id }
  });
  if (!teacher) throw new Error("Teacher not found");
  return teacher;
}

export async function createTimetableSlot(data: {
  timetableId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
  subjectId: string;
}) {
  const teacher = await getTeacher();

  // Basic conflict detection
  const conflict = await db.timetableSlot.findFirst({
    where: {
      timetableId: data.timetableId,
      dayOfWeek: data.dayOfWeek,
      OR: [
        {
          AND: [
            { startTime: { lte: data.startTime } },
            { endTime: { gt: data.startTime } }
          ]
        },
        {
          AND: [
            { startTime: { lt: data.endTime } },
            { endTime: { gte: data.endTime } }
          ]
        }
      ]
    }
  });

  if (conflict) {
    throw new Error("Conflict detected with another class in this time slot.");
  }

  const slot = await db.timetableSlot.create({
    data: {
      ...data,
      teacherId: teacher.id
    }
  });

  revalidatePath("/teacher/timetable");
  return slot;
}

export async function deleteTimetableSlot(slotId: string) {
  const teacher = await getTeacher();
  
  const slot = await db.timetableSlot.findUnique({ where: { id: slotId } });
  if (slot?.teacherId !== teacher.id) throw new Error("Unauthorized");

  await db.timetableSlot.delete({ where: { id: slotId } });
  revalidatePath("/teacher/timetable");
}
