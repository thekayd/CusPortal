require("dotenv").config();
const cors = require("cors");
const fs = require("node:fs");
// import bcrypt from "bcrypt";
const http = require("http");
// const express = require("express");
import express, { Request, Response } from "express";
import { z } from "zod";
const path = require("node:path");
const bcrypt = require("bcrypt");
const https = require("https");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
// const { getEnv } = require("./server");

const environmentVars = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  SSL_KEY_PATH: process.env.SSL_KEY_PATH,
  SSL_CERT_PATH: process.env.SSL_CERT_PATH,
};
function getEnv() {
  if (!environmentVars.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  } else if (!environmentVars.PORT) {
    throw new Error("Missing PORT environment variable");
  } else if (!environmentVars.SSL_KEY_PATH) {
    throw new Error("Missing SSL_KEY_PATH environment variable");
  } else if (!environmentVars.SSL_CERT_PATH) {
    throw new Error("Missing SSL_CERT_PATH environment variable");
  }
  return environmentVars;
}

const HOST = "localhost";
const { JWT_SECRET, PORT, SSL_CERT_PATH, SSL_KEY_PATH } = getEnv();

const app = express();
const port = parseInt(PORT || "3000");

// Middleware
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: `http://${HOST}:${port}`, // or whatever port your React app is running on
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Serve static files from the Next.js build directory
// app.use(express.static(path.join(__dirname, "../build"))); // only necessary for production

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mock database
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
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain alphanumeric characters and underscores"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  body("email").isEmail().withMessage("Invalid email format"),
];

// Define a route for the root URL
// only necessary for production
// app.get("/", (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// // Routes
app.post("/api/register", validateUserInput, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Validate & type values via Zod schema
  const safeUser = userSchema.safeParse({ ...req.body });
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

// // Start HTTP server
// http.createServer(app).listen(port, () => {
//   console.log(`HTTP Server running on http://${HOST}:${port}`);
// });

// // Start HTTPS server
https.createServer(options, app).listen(port + 1, () => {
  console.log(`HTTPS Server running on https://${HOST}:${port + 1}`);
});
