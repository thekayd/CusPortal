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
import ExpressBrute from "express-brute";
import mongoose from 'mongoose';

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
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Brute force protection
const store = new ExpressBrute.MemoryStore(); // You can use a different store for production
export const bruteforce = new ExpressBrute(store, {
  freeRetries: 5, // Number of allowed retries
  minWait: 5000, // Minimum wait time before retrying (in ms)
  maxWait: 60000, // Maximum wait time before retrying (in ms)
  lifetime: 3600, // Lifetime of the brute force record (in seconds)
});

// Serve static files from the Next.js build directory
app.use(express.static(path.join(__dirname, "../build"))); // only necessary for production

// Serve the Create-React-App site
app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// API routes using a controller for clean abstraction
app.use("/api", bruteforce.prevent, userController);
app.use('/api', bruteforce.prevent, paymentController);
app.use('/api', bruteforce.prevent, accountController);
// Start HTTPS server
https.createServer(options, app).listen(port + 1, () => {
  console.log(`HTTPS Server running on https://${HOST}:${port + 1}`);
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
});