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

export async function createAssignment(data: {
  title: string;
  description: string;
  deadline: Date;
  subjectId: string;
  priority: string;
  attachments?: string;
}) {
  const teacher = await getTeacher();

  // Verify teacher teaches this subject
  const teaches = await db.teacherSubject.findFirst({
    where: { teacherId: teacher.id, subjectId: data.subjectId }
  });

  if (!teaches) throw new Error("Unauthorized: You do not teach this subject");

  const assignment = await db.assignment.create({
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      subjectId: data.subjectId,
      priority: data.priority,
      teacherId: teacher.id,
      attachments: data.attachments,
    }
  });

  revalidatePath("/teacher/assignments");
  revalidatePath("/student/tasks"); // So students see new assignments
  return assignment;
}

export async function deleteAssignment(assignmentId: string) {
  const teacher = await getTeacher();

  const existing = await db.assignment.findUnique({ where: { id: assignmentId } });
  if (existing?.teacherId !== teacher.id) throw new Error("Unauthorized");

  await db.assignment.delete({
    where: { id: assignmentId }
  });

  revalidatePath("/teacher/assignments");
  revalidatePath("/student/tasks");
}
