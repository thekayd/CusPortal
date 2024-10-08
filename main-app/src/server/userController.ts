import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { matchedData, validationResult } from "express-validator";
import { loginPayload, User, userSchema, validateUserInput } from "./validators";

// Mock database with Data model schemas
let users: User[] = [];

const router = Router();

// Handles Registration of new users
router.post("/register", validateUserInput, async (req: Request, res: Response) => {
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
  const { username, password, email, fullName, idNumber, accountNumber } = safeUser.data;

  // Check if user already exists
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save user
  users.push({ username, password: hashedPassword, email, fullName, idNumber, accountNumber });

  res.status(201).json({ message: "User registered successfully" });
});

// Handles Login of existing users
router.post("/login", async (req, res) => {
  // Validate & type values via Zod schema
  const safePayload = loginPayload.safeParse({ ...req.body });
  if (safePayload.error) {
    return res.status(400).json({ message: safePayload.error.message });
  }
  const { username, password, accountNumber } = safePayload.data;

  // Find user
  const user = users.find(
    (user) => user.username === username && user.accountNumber === accountNumber
  );
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

export default router;
