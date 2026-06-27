"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function createDepartment(name: string, code: string) {
  await verifyAdmin();
  const dept = await db.department.create({ data: { name, code } });
  revalidatePath("/admin/departments");
  return dept;
}

export async function deleteDepartment(id: string) {
  await verifyAdmin();
  await db.department.delete({ where: { id } });
  revalidatePath("/admin/departments");
}

export async function createCourse(name: string, code: string, departmentId: string) {
  await verifyAdmin();
  const course = await db.course.create({ data: { name, code, departmentId } });
  revalidatePath("/admin/departments");
  return course;
}

export async function deleteCourse(id: string) {
  await verifyAdmin();
  await db.course.delete({ where: { id } });
  revalidatePath("/admin/departments");
}

export async function createSemester(number: number, courseId: string) {
  await verifyAdmin();
  const sem = await db.semester.create({ data: { number, courseId } });
  revalidatePath("/admin/departments");
  return sem;
}

export async function deleteSemester(id: string) {
  await verifyAdmin();
  await db.semester.delete({ where: { id } });
  revalidatePath("/admin/departments");
}
