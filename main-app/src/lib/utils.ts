import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const SERVER_PATH = "https://localhost:3001" as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
