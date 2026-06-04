import { RequestHandler } from "express";
import { verifyCredentials } from "../auth/credentials";

/**
 * Login route - authenticates user and creates session
 */
export const handleLogin: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  // Verify credentials
  const isValid = await verifyCredentials(username, password);

  if (!isValid) {
    // Don't reveal if username or password is wrong for security
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // Create session
  req.session.adminId = "admin";
  req.session.save((err) => {
    if (err) {
      console.error("Session save error:", err);
      res.status(500).json({ error: "Session creation failed" });
      return;
    }

    res.json({ success: true, message: "Login successful" });
  });
};

/**
 * Logout route - destroys session
 */
export const handleLogout: RequestHandler = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      res.status(500).json({ error: "Logout failed" });
      return;
    }

    // Clear cookie
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
  });
};

/**
 * Check auth status
 */
export const handleCheckAuth: RequestHandler = (req, res) => {
  const isAuthenticated = !!req.session.adminId;
  res.json({ authenticated: isAuthenticated });
};
