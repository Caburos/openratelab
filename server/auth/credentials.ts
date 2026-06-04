import bcrypt from "bcryptjs";

// Admin password - change in production!
const ADMIN_PASSWORD = "ILAisaTEA1308988500397";

export interface AdminCredentials {
  username: string;
  password: string;
}

export const ADMIN_CREDENTIALS: AdminCredentials = {
  username: "korene",
  password: ADMIN_PASSWORD,
};

/**
 * Verify admin credentials
 * Using direct comparison for simplicity - can upgrade to bcrypt later
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  console.log(`[Auth] Login attempt: username='${username}'`);

  if (username !== ADMIN_CREDENTIALS.username) {
    console.log(`[Auth] Username mismatch: ${username} !== ${ADMIN_CREDENTIALS.username}`);
    return false;
  }

  if (password !== ADMIN_CREDENTIALS.password) {
    console.log(`[Auth] Password mismatch`);
    return false;
  }

  console.log(`[Auth] Login successful for '${username}'`);
  return true;
}
