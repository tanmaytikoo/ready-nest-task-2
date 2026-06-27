"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createNote(title: string, content: string, subjectId?: string | null, attachments?: string | null) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
  });
  if (!student) throw new Error("Student not found");

  const note = await db.note.create({
    data: {
      title,
      content,
      studentId: student.id,
      subjectId: subjectId || null,
      attachments: attachments || null,
    },
  });

  revalidatePath("/student/notes");
  return note;
}

export async function updateNote(id: string, title: string, content: string, subjectId?: string | null, attachments?: string | null) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const note = await db.note.update({
    where: { id },
    data: {
      title,
      content,
      subjectId: subjectId || null,
      attachments: attachments || null,
    },
  });

  revalidatePath("/student/notes");
  return note;
}

export async function deleteNote(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.note.delete({
    where: { id },
  });

  revalidatePath("/student/notes");
}
