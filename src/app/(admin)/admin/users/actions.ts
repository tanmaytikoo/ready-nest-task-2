"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function deleteUser(id: string) {
  await verifyAdmin();
  await db.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function updateUser(id: string, role: string, data: { departmentId?: string, semesterId?: string }) {
  await verifyAdmin();
  
  if (role === "STUDENT" && data.departmentId && data.semesterId) {
    await db.student.update({
      where: { userId: id },
      data: {
        departmentId: data.departmentId,
        semesterId: data.semesterId
      }
    });
  } else if (role === "TEACHER" && data.departmentId) {
    await db.teacher.update({
      where: { userId: id },
      data: {
        departmentId: data.departmentId
      }
    });
  }
  
  revalidatePath("/admin/users");
}
