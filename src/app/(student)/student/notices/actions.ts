"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markNoticeAsRead(noticeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.noticeRead.upsert({
    where: {
      noticeId_userId: {
        noticeId,
        userId: session.user.id
      }
    },
    update: { readAt: new Date() },
    create: {
      noticeId,
      userId: session.user.id
    }
  });

  revalidatePath("/student/notices");
}
