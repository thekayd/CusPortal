require("dotenv").config();
import z from "zod";

// This allows the environment variables to be structured, typesafe, and secure for Server & client use

const envSchema = z.object({
  PORT: z.string().nonempty(),
  SSL_KEY_PATH: z.string().nonempty(),
  SSL_CERT_PATH: z.string().nonempty(),
  MONGODB_URI: z.string().nonempty(),
});

const environmentVars = {
  PORT: process.env.PORT,
  SSL_KEY_PATH: process.env.SSL_KEY_PATH,
  SSL_CERT_PATH: process.env.SSL_CERT_PATH,
  MONGODB_URI: process.env.MONGODB_URI,
};

export default function getEnv() {
  if (!environmentVars.PORT) {
    throw new Error("Missing PORT environment variable");
  } else if (!environmentVars.SSL_KEY_PATH) {
    throw new Error("Missing SSL_KEY_PATH environment variable");
  } else if (!environmentVars.SSL_CERT_PATH) {
    throw new Error("Missing SSL_CERT_PATH environment variable");
  } else if (!environmentVars.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  const safeVars = envSchema.safeParse(environmentVars);
  if (safeVars.error) throw new Error("Invalid environment variables");

  return safeVars.data;
}
