import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Nova Student Portal" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Reset your Nova password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p style="color: #555; line-height: 1.5;">
          Hello,
          <br><br>
          We received a request to reset the password for your Nova account. If you did not request this, you can safely ignore this email.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #777; font-size: 12px; text-align: center;">
          This link will expire in 1 hour.<br>
          If the button doesn't work, copy and paste this URL into your browser:<br>
          <a href="${resetLink}" style="color: #555;">${resetLink}</a>
        </p>
      </div>
    `,
  });
};
