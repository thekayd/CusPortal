import { Response } from "express";
import bcrypt from "bcrypt";

// Handles errors in the Server
export function handleServerError(
  error: any,
  res: Response,
  source?: string,
  action?: string
): Response {
  console.error(`${source} ${action} Error in Server:`, error);
  return res.status(500).json({ message: error?.message || "Error registering user" });
}

// Handles Errors from MongoDB (any database operation)
export function handleMongoError(error: any, model?: string, action?: string): Response {
  console.error(`${action} on ${model} - Error:`, error);
  return error;
}

// Handles validating hashed passwords
export async function validatePassword(storedPassword: string, password: string): Promise<boolean> {
  return await bcrypt.compare(password, storedPassword);
}
