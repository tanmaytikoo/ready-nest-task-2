import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const existingToken = await db.verificationToken.findFirst({
      where: { token },
    });

    if (!existingToken) {
      return new NextResponse("Invalid token", { status: 400 });
    }

    if (new Date() > new Date(existingToken.expires)) {
      return new NextResponse("Token expired", { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
