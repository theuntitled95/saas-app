import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "notifications@tadreeb.com",
    to: [email],
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password. This link will expire in 15 minutes.</p>
      <a href="${url}">${url}</a>
    `,
  });
}
