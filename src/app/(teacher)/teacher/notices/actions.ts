"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { NoticeCategory } from "@prisma/client";

async function getTeacher() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createNotice(data: { title: string; content: string; category: NoticeCategory; pinned: boolean }) {
  const userId = await getTeacher();

  const notice = await db.notice.create({
    data: {
      ...data,
      authorId: userId,
      isGlobal: false // Only admins can create global notices
    }
  });

  revalidatePath("/teacher/notices");
  // Assuming student notice board might be on dashboard
  revalidatePath("/student/dashboard");
  return notice;
}

export async function deleteNotice(noticeId: string) {
  const userId = await getTeacher();
  
  const existing = await db.notice.findUnique({ where: { id: noticeId } });
  if (existing?.authorId !== userId) throw new Error("Unauthorized");

  await db.notice.delete({ where: { id: noticeId } });
  
  revalidatePath("/teacher/notices");
  revalidatePath("/student/dashboard");
}

export async function togglePinNotice(noticeId: string, pinned: boolean) {
  const userId = await getTeacher();
  
  const existing = await db.notice.findUnique({ where: { id: noticeId } });
  if (existing?.authorId !== userId) throw new Error("Unauthorized");

  await db.notice.update({
    where: { id: noticeId },
    data: { pinned }
  });
  
  revalidatePath("/teacher/notices");
  revalidatePath("/student/dashboard");
}
