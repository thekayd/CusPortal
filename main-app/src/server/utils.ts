import { Response } from "express";
import bcrypt from "bcrypt";

export function handleServerError(
  error: any,
  res: Response,
  source?: string,
  action?: string
): Response {
  console.error(`${source} ${action} Error in Server:`, error);
  return res.status(500).json({ message: error?.message || "Error registering user" });
}

export function handleMongoError(error: any, model?: string, action?: string): Response {
  console.error(`${action} on ${model} - Error:`, error);
  return error;
}

// Function to validate passwords
export async function validatePassword(storedPassword: string, password: string): Promise<boolean> {
  return await bcrypt.compare(password, storedPassword);
}
