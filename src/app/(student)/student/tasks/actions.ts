"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { TaskStatus } from "@prisma/client";

async function getStudent() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const student = await db.student.findUnique({
    where: { userId: session.user.id }
  });
  if (!student) throw new Error("Student not found");
  return student;
}

export async function createTask(title: string, deadline?: Date | null) {
  const student = await getStudent();
  const task = await db.task.create({
    data: {
      title,
      status: TaskStatus.PENDING,
      studentId: student.id,
      priority: "NORMAL",
      deadline: deadline || null,
    }
  });
  revalidatePath("/student/tasks");
  revalidatePath("/student/dashboard");
  return task;
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const student = await getStudent();
  
  // Verify task belongs to student
  const existing = await db.task.findUnique({ where: { id: taskId } });
  if (existing?.studentId !== student.id) throw new Error("Unauthorized");

  const task = await db.task.update({
    where: { id: taskId },
    data: { status }
  });
  
  revalidatePath("/student/tasks");
  revalidatePath("/student/dashboard");
  return task;
}

export async function deleteTask(taskId: string) {
  const student = await getStudent();
  
  // Verify task belongs to student
  const existing = await db.task.findUnique({ where: { id: taskId } });
  if (existing?.studentId !== student.id) throw new Error("Unauthorized");

  await db.task.delete({
    where: { id: taskId }
  });
  
  revalidatePath("/student/tasks");
  revalidatePath("/student/dashboard");
}
