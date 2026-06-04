import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import { handleDemo } from "./routes/demo";
import {
  handleGetContent,
  handleUpdateSection,
  handleGetSection,
} from "./routes/content";
import {
  handleContactSubmission,
  handleGetContacts,
  handleMarkContactRead,
  handleDeleteContact,
} from "./routes/contact";
import { handleLogin, handleLogout, handleCheckAuth } from "./routes/auth";
import { requireAuth } from "./auth/middleware";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Auth routes (public)
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/check", handleCheckAuth);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Public content routes (reading is public)
  app.get("/api/content", handleGetContent);
  app.get("/api/content/:section", handleGetSection);

  // Protected content management routes
  app.post("/api/content/section", requireAuth, handleUpdateSection);

  // Public contact form submission
  app.post("/api/contact", handleContactSubmission);

  // Protected contact management routes
  app.get("/api/contacts", requireAuth, handleGetContacts);
  app.put("/api/contacts/:id", requireAuth, handleMarkContactRead);
  app.delete("/api/contacts/:id", requireAuth, handleDeleteContact);

  return app;
}
