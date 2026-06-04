import { RequestHandler } from "express";
import { ContactFormData, ContactSubmission } from "@shared/content";
import * as fs from "fs";
import * as path from "path";
import { Resend } from "resend";

// Netlify Lambda filesystem is read-only except /tmp
const DATA_DIR = process.env.LAMBDA_TASK_ROOT
  ? "/tmp"
  : path.join(process.cwd(), "data");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.error("Failed to create data directory:", error);
  }
}

function readContacts(): ContactSubmission[] {
  ensureDataDir();
  try {
    if (fs.existsSync(CONTACTS_FILE)) {
      const data = fs.readFileSync(CONTACTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading contacts file:", error);
  }
  return [];
}

function writeContacts(contacts: ContactSubmission[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing contacts file:", error);
  }
}

async function sendEmailNotification(submission: ContactSubmission): Promise<void> {
  const { RESEND_API_KEY, CONTACT_EMAIL_TO } = process.env;

  if (!RESEND_API_KEY || !CONTACT_EMAIL_TO) {
    console.log("Resend not configured — skipping email notification");
    return;
  }

  const resend = new Resend(RESEND_API_KEY);

  await resend.emails.send({
    from: "UrosBuilds Contact <noreply@urosbuilds.com>",
    to: CONTACT_EMAIL_TO,
    reply_to: submission.email,
    subject: `New contact from ${submission.name}`,
    text: [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Project type: ${submission.projectType || "—"}`,
      `Budget: ${submission.budget || "—"}`,
      ``,
      `Message:`,
      submission.message,
    ].join("\n"),
  });
}

export const handleContactSubmission: RequestHandler = async (req, res) => {
  const { name, email, message, projectType, budget } =
    req.body as ContactFormData;

  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return;
  }

  const submission: ContactSubmission = {
    id: Date.now().toString(),
    name,
    email,
    message,
    projectType,
    budget,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const contacts = readContacts();
  contacts.push(submission);
  writeContacts(contacts);

  try {
    await sendEmailNotification(submission);
  } catch (error) {
    console.error("Email notification failed:", error);
  }

  console.log("New contact submission:", submission);

  res.json({
    success: true,
    message: "Your message has been received. We'll get back to you soon!",
  });
};

export const handleGetContacts: RequestHandler = (req, res) => {
  const contacts = readContacts();
  res.json(contacts);
};

export const handleMarkContactRead: RequestHandler = (req, res) => {
  const { id } = req.params;

  const contacts = readContacts();
  const contact = contacts.find((c) => c.id === id);

  if (!contact) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }

  contact.read = true;
  writeContacts(contacts);

  res.json({ success: true, message: "Contact marked as read" });
};

export const handleDeleteContact: RequestHandler = (req, res) => {
  const { id } = req.params;

  let contacts = readContacts();
  const initialLength = contacts.length;
  contacts = contacts.filter((c) => c.id !== id);

  if (contacts.length === initialLength) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }

  writeContacts(contacts);

  res.json({ success: true, message: "Contact deleted" });
};
