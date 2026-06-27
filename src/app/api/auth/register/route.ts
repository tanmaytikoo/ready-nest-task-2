import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, code, role, accessCode } = await req.json();

    if (!name || !email || !password || !code || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (role === "TEACHER") {
      const EXPECTED_CODE = process.env.ADMIN_ACCESS_CODE || "NOVA-TEACH-2026";
      if (accessCode !== EXPECTED_CODE) {
        return NextResponse.json(
          { message: "Invalid Admin Access Code" },
          { status: 403 }
        );
      }
    }

    if (role === "ADMIN") {
      const MASTER_CODE = process.env.MASTER_ADMIN_CODE || "NOVA-MASTER-2026";
      if (accessCode !== MASTER_CODE) {
        return NextResponse.json(
          { message: "Invalid Master Admin Code" },
          { status: 403 }
        );
      }
    }

    // Verify Code
    const verification = await db.verificationToken.findFirst({
      where: {
        email,
        token: code,
      },
      orderBy: { expires: 'desc' }
    });

    if (!verification || verification.expires < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Fetch the default department and semester for students/teachers
    let defaultDept = null;
    let defaultSem = null;

    if (role !== "ADMIN") {
      defaultDept = await db.department.findFirst();
      defaultSem = await db.semester.findFirst();

      if (!defaultDept || !defaultSem) {
        return NextResponse.json({ message: "System configuration error: No departments found." }, { status: 500 });
      }
    }

    // Use a transaction to ensure both records are created, or neither are
    await db.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role === "TEACHER" ? "TEACHER" : role === "ADMIN" ? "ADMIN" : "STUDENT",
        },
      });

      if (role === "TEACHER" && defaultDept) {
        await prisma.teacher.create({
          data: {
            userId: user.id,
            departmentId: defaultDept.id,
          }
        });
      } else if (role === "STUDENT" && defaultDept && defaultSem) {
        await prisma.student.create({
          data: {
            userId: user.id,
            enrollmentNo: `STU${Math.floor(Math.random() * 1000000)}`,
            departmentId: defaultDept.id,
            semesterId: defaultSem.id,
          }
        });
      }
      // If role === "ADMIN", we only need the user record created above
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
