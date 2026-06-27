import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    // Generate 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Save to VerificationToken
    await db.verificationToken.create({
      data: {
        email,
        token: code,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      }
    });

    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      try {
        // Send email using Nodemailer
        await transporter.sendMail({
          from: `"Nova" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: "Your Nova Verification Code",
          html: `<div style="font-family: sans-serif; text-align: center; padding: 20px;">
                   <h2>Welcome to Nova!</h2>
                   <p>Your 4-digit verification code is:</p>
                   <h1 style="font-size: 32px; letter-spacing: 5px; color: #3b82f6;">${code}</h1>
                   <p>This code will expire in 15 minutes.</p>
                 </div>`,
        });
      } catch (e) {
        console.error("Nodemailer error:", e);
        // Don't throw an error to the frontend if SMTP fails in development
      }
    }
    
    // Fallback for development/testing
    console.log(`\n\n=== VERIFICATION CODE FOR ${email}: ${code} ===\n\n`);

    return NextResponse.json({ message: "Code sent successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Send code error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
