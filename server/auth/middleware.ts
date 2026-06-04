import { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Session {
      adminId?: string;
      userId?: string;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 * Returns 401 if not authenticated
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.adminId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

/**
 * Middleware to check if user is authenticated (for pages)
 * Redirects to /login if not authenticated
 */
export const requireAuthPage: RequestHandler = (req, res, next) => {
  if (!req.session.adminId) {
    res.redirect("/login");
    return;
  }
  next();
};
