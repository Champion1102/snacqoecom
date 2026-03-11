import nodemailer from "nodemailer";

function isZohoConfigured(): boolean {
  return !!(
    process.env.ZOHO_SMTP_HOST &&
    process.env.ZOHO_SMTP_USER &&
    process.env.ZOHO_SMTP_PASS
  );
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  if (isZohoConfigured()) {
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Snacqo" <${process.env.ZOHO_SMTP_USER}>`,
      to: email,
      subject: "Your Snacqo login code",
      text: `Your one-time login code is: ${code}\n\nIt expires in 10 minutes. If you didn't request this, you can ignore this email.`,
      html: `
        <p>Your one-time login code is: <strong>${code}</strong></p>
        <p>It expires in 10 minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      `.trim(),
    });
    return;
  }

  console.log(`[Email] OTP for ${email}: ${code}`);
}
