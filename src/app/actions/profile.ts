"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateAvatar(url: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.user.update({
    where: { id: session.user.id },
    data: { avatar: url }
  });

  revalidatePath("/", "layout");
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return { error: "Incorrect current password" };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  return { success: true };
}

export async function updateProfile(name: string, email: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check if email is already taken by another user
  const existing = await db.user.findUnique({ where: { email } });
  if (existing && existing.id !== session.user.id) {
    return { error: "Email is already in use by another account" };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name, email }
  });

  revalidatePath("/", "layout");
  return { success: true };
}
