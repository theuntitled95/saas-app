import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "notifications@tadreeb.com",
    to: [email],
    subject: "Verify your email address",
    html: `
      <p>Click the link below to verify your email address:</p>
      <a href="${url}">${url}</a>
    `,
  });
}
