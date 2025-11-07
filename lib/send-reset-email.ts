// lib/send-reset-email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendResetEmail({
  to,
  resetUrl,
  name,
}: {
  to: string;
  resetUrl: string;
  name?: string | null;
}) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hello${name ? `, ${name}` : ""} 👋</h2>
        <p>You requested a password reset for your account.</p>
        <p>Click the link below to reset your password:</p>
        <p>
          <a href="${resetUrl}" 
            style="background: #2563eb; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in <b>1 hour</b>.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <hr />
        <small>This email was sent automatically. Do not reply.</small>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Reset email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send reset email");
  }
}
