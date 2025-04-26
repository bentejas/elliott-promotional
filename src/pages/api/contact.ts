import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const { fullName, email, phone, company, source, message } =
    await request.json();

  // configure these via ENV (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT!,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Quote Request" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `New Quote Request from ${fullName}`,
    text: `
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Company: ${company}
How found us: ${source}

Message:
${message}
    `,
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
