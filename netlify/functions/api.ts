import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL_TO ?? "hello@openratelab.com";
const RESEND_KEY = process.env.RESEND_API_KEY;
const CHECKLIST_URL = "https://openratelab.com/downloads/openratelab-klaviyo-audit-checklist.xlsx";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body: {
    name?: string;
    email?: string;
    service?: string;
    message?: string;
    esp?: string;
    platform?: string;
    revenueRange?: string;
    challenge?: string;
    timeline?: string;
  };
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const { name, email, service, message, esp, platform, revenueRange, challenge, timeline } = body;

  // Only email is truly required — the lead-magnet form has no name/message
  // fields, while the main contact form sends all of these.
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "email is required" }),
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid email" }) };
  }

  if (RESEND_KEY) {
    try {
      const resend = new Resend(RESEND_KEY);
      const lines = [`Name: ${name || "(not provided)"}`, `Email: ${email}`];
      if (service) lines.push(`Brand/Store: ${service}`);
      if (esp) lines.push(`Current ESP: ${esp}`);
      if (platform) lines.push(`Store Platform: ${platform}`);
      if (revenueRange) lines.push(`Revenue/List Size: ${revenueRange}`);
      if (challenge) lines.push(`Biggest Challenge: ${challenge}`);
      if (timeline) lines.push(`Timeline: ${timeline}`);
      if (message) lines.push("", "Message:", message);

      await resend.emails.send({
        from: "OpenRateLab Contact <noreply@openratelab.com>",
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: name ? `New enquiry from ${name}` : `New lead magnet signup: ${email}`,
        text: lines.join("\n"),
      });

      // Lead-magnet submissions (no name field) promise "check your inbox
      // shortly" on the site — actually deliver the checklist as an
      // attachment instead of only notifying us of the signup.
      if (!name) {
        try {
          const fileRes = await fetch(CHECKLIST_URL);
          if (!fileRes.ok) throw new Error(`Checklist fetch failed: ${fileRes.status}`);
          const fileBuffer = Buffer.from(await fileRes.arrayBuffer());

          await resend.emails.send({
            from: "OpenRateLab <noreply@openratelab.com>",
            to: email,
            replyTo: CONTACT_EMAIL,
            subject: "Your Klaviyo Audit Checklist",
            text: "Here's the 36-point Klaviyo audit checklist we run on every account audit: flow architecture, campaign cadence, list health, and deliverability.\n\nOpen it, set each item to Pass / Needs work / Missing / N/A, and the Start Here tab scores it for you automatically.\n\nWant a second pair of eyes on the results? Just reply to this email or book a free audit at https://openratelab.com/#contact.\n\n— OpenRateLab",
            attachments: [
              {
                filename: "OpenRateLab-Klaviyo-Audit-Checklist.xlsx",
                content: fileBuffer,
              },
            ],
          });
        } catch (attachErr) {
          console.error("Checklist delivery error:", attachErr);
        }
      }
    } catch (err) {
      console.error("Resend error:", err);
    }
  } else {
    console.log("RESEND_API_KEY not set — skipping email send");
    console.log({ name, email, service, message, esp, platform, revenueRange, challenge, timeline });
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ success: true }),
  };
};
