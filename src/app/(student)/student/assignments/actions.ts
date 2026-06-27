"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitAssignment(assignmentId: string, attachments: any[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const student = await db.student.findUnique({
    where: { userId: session.user.id }
  });

  if (!student) throw new Error("Student profile not found");

  await db.assignmentSubmission.create({
    data: {
      assignmentId,
      studentId: student.id,
      attachments: JSON.stringify(attachments),
    }
  });

  // Also update task status if it exists
  const task = await db.task.findFirst({
    where: {
      studentId: student.id,
      title: { contains: "Assignment" } // Simple heuristic for now, better to link Task to Assignment directly in future
    }
  });

  revalidatePath("/student/assignments", "page");
  revalidatePath("/student/dashboard", "page");
  return { success: true };
}
