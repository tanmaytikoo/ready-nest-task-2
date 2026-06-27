import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const defaultDept = await db.department.findFirst();
    
    if (!defaultDept) return NextResponse.json({ error: "no dept" });

    let errDetails = "none";

    try {
      await db.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {
            name: "Test",
            email: "test.teacher." + Date.now() + "@test.com",
            password: "hash",
            role: "TEACHER",
          },
        });

        await prisma.teacher.create({
          data: {
            userId: user.id,
            departmentId: defaultDept.id,
          }
        });
      });
    } catch (e: any) {
      errDetails = e.message || String(e);
      console.error(e);
    }

    return NextResponse.json({ message: "Test done", errDetails });
  } catch (error: any) {
    return NextResponse.json({ message: "Fatal error", details: error.message });
  }
}
