"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createSubject(name: string, code: string, courseId: string, semesterId: string) {
  await verifyAdmin();
  const subject = await db.subject.create({ data: { name, code, courseId, semesterId } });
  revalidatePath("/admin/subjects");
  return subject;
}

export async function deleteSubject(id: string) {
  await verifyAdmin();
  await db.subject.delete({ where: { id } });
  revalidatePath("/admin/subjects");
}

export async function assignTeacherToSubject(teacherId: string, subjectId: string) {
  await verifyAdmin();
  
  // Check if mapping already exists
  const exists = await db.teacherSubject.findUnique({
    where: { teacherId_subjectId: { teacherId, subjectId } }
  });
  if (exists) throw new Error("Teacher is already assigned to this subject.");

  const mapping = await db.teacherSubject.create({
    data: { teacherId, subjectId }
  });
  revalidatePath("/admin/subjects");
  return mapping;
}

export async function removeTeacherFromSubject(teacherId: string, subjectId: string) {
  await verifyAdmin();
  await db.teacherSubject.delete({
    where: { teacherId_subjectId: { teacherId, subjectId } }
  });
  revalidatePath("/admin/subjects");
}
