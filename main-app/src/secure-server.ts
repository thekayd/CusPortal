import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import https from "https";
import helmet from "helmet";
import express, { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import getEnv from "./server/secrets";
import userController from "./server/userController";
import paymentController from "./server/paymentController";
import accountController from "./server/accountInfoController";
import employeeController from "./server/employeeController";
import ExpressBrute from "express-brute";
import mongoose from "mongoose";

// Providing typesafety, and Validation of Environment Variables
const HOST = "localhost";
const { PORT, SSL_KEY_PATH, SSL_CERT_PATH, MONGODB_URI } = getEnv();
const options = {
  // SSL Config
  key: fs.readFileSync(SSL_KEY_PATH),
  cert: fs.readFileSync(SSL_CERT_PATH),
};

const app = express();
const port = parseInt(PORT || "3000");

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(express.json()); // for parsing application/json
app.use(helmet()); // for security
app.use(
  cors({
    origin: `https://${HOST}:${port + 1}`, // Ensuring it only allows request from the same origin (Prevents )
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Brute force protection
const store = new ExpressBrute.MemoryStore(); // You can use a different store for production
export const bruteforce = new ExpressBrute(store, {
  freeRetries: 50, // Increased number of allowed retries
  minWait: 5000, // Minimum wait time before retrying (in ms)
  maxWait: 120000, // Increased maximum wait time before retrying (in ms)
  lifetime: 7200, // Increased lifetime of the brute force record (in seconds)
});

// Serve static files from the Next.js build directory
app.use(express.static(path.join(__dirname, "../build"))); // only necessary for production

// API routes using a controller for clean abstraction
app.use("/api", bruteforce.prevent, userController);
app.use("/api", bruteforce.prevent, paymentController);
app.use("/api", bruteforce.prevent, accountController);
app.use("/api", bruteforce.prevent, employeeController);

// Serve the Create-React-App site
app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// Start HTTPS server
https.createServer(options, app).listen(port + 1, () => {
  console.log(`HTTPS Server running on https://${HOST}:${port + 1}`);
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1);
  }
});
