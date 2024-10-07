require("dotenv").config();
import cors from "cors";
import fs from "node:fs";
import { z } from "zod";
import path from "node:path";
import bcrypt from "bcrypt";
import https from "https";
import helmet from "helmet";
import express, { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { body, matchedData, validationResult } from "express-validator";

// Providing typesafety, and Validation of Environment Variables
const HOST = "localhost";
const environmentVars = {
  PORT: process.env.PORT || "3000",
  SSL_KEY_PATH: process.env.SSL_KEY_PATH || "",
  SSL_CERT_PATH: process.env.SSL_CERT_PATH || "",
};
const { PORT, SSL_CERT_PATH, SSL_KEY_PATH } = environmentVars;

const app = express();
const port = parseInt(PORT || "3000");

// Middleware
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: `https://${HOST}:${port + 1}`,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Serve static files from the Next.js build directory
app.use(express.static(path.join(__dirname, "../build"))); // only necessary for production

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mock database with Data model schemas
const userSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  email: z.string().email({
    message: "Invalid email format.",
  }),
});
const loginPayload = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
type User = z.infer<typeof userSchema>;
let users: User[] = [];

// Input validation middleware
const validateUserInput = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 5, max: 32 })
    .withMessage("Username must be between 5 and 32 characters")
    .isString()
    .withMessage("Username must be a string")
    .matches(/^[a-zA-Z0-9]+$/) // Only allows alphanumeric characters
    .withMessage("Username must be alphanumeric and cannot contain spaces or special characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ min: 5, max: 32 })
    .withMessage("Email must be between 5 and 32 characters")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isString()
    .withMessage("Password must be a string")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long, and must require at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

// Serve the Create-React-App site
app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Handles Registration of new users
app.post("/api/register", validateUserInput, async (req: Request, res: Response) => {
  // Validate inputs with middleware
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const messages: string[] = result.array().map((error) => error.msg);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Validate & type values via Zod schema
  const safeUser = userSchema.safeParse(matchedData(req));
  if (safeUser.error) {
    return res.status(400).json({ message: safeUser.error.message });
  }
  const { username, password, email } = safeUser.data;

  // Check if user already exists
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save user
  users.push({ username, password: hashedPassword, email });

  res.status(201).json({ message: "User registered successfully" });
});

// Handles Login of existing users
app.post("/api/login", async (req, res) => {
  // Validate & type values via Zod schema
  const safePayload = loginPayload.safeParse({ ...req.body });
  if (safePayload.error) {
    return res.status(400).json({ message: safePayload.error.message });
  }
  const { username, password } = safePayload.data;

  // Find user
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Logged in successfully" });
});

// SSL configuration
const options = {
  key: fs.readFileSync(SSL_KEY_PATH),
  cert: fs.readFileSync(SSL_CERT_PATH),
};

// Start HTTPS server
// https.createServer(options, app).listen(port, () => {
//   console.log(`HTTPS Server running on https://${HOST}:${port}`);
// });

// Start HTTPS server
https.createServer(options, app).listen(port + 1, () => {
  console.log(`HTTPS Server running on https://${HOST}:${port + 1}`);
});
// Madrhino$s128
