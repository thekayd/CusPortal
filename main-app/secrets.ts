import z from "zod";

const envSchema = z.object({
  PORT: z.string().nonempty(),
  HOST: z.string().nonempty(),
  JWT_SECRET: z.string().nonempty(),
  SSL_KEY_PATH: z.string().nonempty(),
  SSL_CERT_PATH: z.string().nonempty(),
});

const environmentVars = {
  PORT: process.env.PORT,
  HOST: process.env.HOST,
  JWT_SECRET: process.env.JWT_SECRET,
  SSL_KEY_PATH: process.env.SSL_KEY_PATH,
  SSL_CERT_PATH: process.env.SSL_CERT_PATH,
};

export default function getEnv() {
  if (!environmentVars.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  } else if (!environmentVars.PORT) {
    throw new Error("Missing PORT environment variable");
  } else if (!environmentVars.SSL_KEY_PATH) {
    throw new Error("Missing SSL_KEY_PATH environment variable");
  } else if (!environmentVars.SSL_CERT_PATH) {
    throw new Error("Missing SSL_CERT_PATH environment variable");
  } else if (!environmentVars.HOST) {
    throw new Error("Missing HOST environment variable");
  }

  const safeVars = envSchema.safeParse(environmentVars);
  if (safeVars.error) throw new Error("Invalid environment variables");

  return safeVars.data;
}