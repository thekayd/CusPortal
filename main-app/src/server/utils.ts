import { Response } from "express";
export function handleServerError(
  error: any,
  res: Response,
  source?: string,
  action?: string
): Response {
  console.error(`${source} ${action} Error in Server:`, error);
  return res.status(500).json({ message: error?.message || "Error registering user" });
}
