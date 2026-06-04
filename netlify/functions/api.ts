import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL_TO ?? "uros@openratelab.com";
const RESEND_KEY = process.env.RESEND_API_KEY;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body: { name?: string; email?: string; service?: string; message?: string };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, service, message } = body;

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "name, email and message are required" }),
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid email" }) };
  }

  if (RESEND_KEY) {
    try {
      const resend = new Resend(RESEND_KEY);
      await resend.emails.send({
        from: "OpenRateLab Contact <noreply@openratelab.com>",
        to: CONTACT_EMAIL,
        reply_to: email,
        subject: `New enquiry from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Service: ${service || "—"}`,
          ``,
          `Message:`,
          message,
        ].join("\n"),
      });
    } catch (err) {
      console.error("Resend error:", err);
    }
  } else {
    console.log("RESEND_API_KEY not set — skipping email send");
    console.log({ name, email, service, message });
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: true }),
  };
};
