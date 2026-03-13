import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email, name) {
  try {
    await resend.emails.send({
      from: "UltraNova <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to UltraNova 🚀",
      html: `
        <h2>Welcome to UltraNova 🚀</h2>
        <p>Hi ${name},</p>
        <p>Thanks for joining the UltraNova waitlist!</p>
        <p>We'll notify you when we launch.</p>
      `
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error);
  }
}