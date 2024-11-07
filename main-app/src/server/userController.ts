import { Request, Response, Router } from "express";
import { matchedData, validationResult } from "express-validator";
import { loginPayload, User, userSchema, validateUserInput } from "./validators";
import { createUser, findUser, validatePassword } from "../db/mongodb-integration";

const router = Router();

// GET ALL (Index)
router.get("/users", async (req: Request, res: Response) => {
  return;
});

// GET Specific (Show)
router.get("/users/:id", async (req: Request, res: Response) => {
  return;
});

// Handles Registration of new users
router.post("/register", validateUserInput, async (req: Request, res: Response) => {
  // Validate inputs with middleware
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const messages: string[] = result.array().map((error) => error.msg);
    res.status(400).json({ message: messages.join(", ") });
    return;
  }

  // Validate & type values via Zod schema
  const safeUser = userSchema.safeParse(matchedData(req));
  if (safeUser.error) {
    res.status(400).json({ message: safeUser.error.message });
    return;
  }
  const userData = safeUser.data;

  try {
    // Save user
    await createUser(userData);
    res.status(201).json({ message: "User registered successfully" });
    return;
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
    return;
  }
});

// Handles Login of existing users
router.post("/login", async (req: Request, res: Response) => {
  // Validate & type values via Zod schema
  const safePayload = loginPayload.safeParse({ ...req.body });
  if (safePayload.error) {
    res.status(400).json({ message: safePayload.error.message });
    return;
  }
  const { username, password, accountNumber } = safePayload.data;

  try {
    // Find user
    const user = await findUser(username, accountNumber);
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Check password
    const validPassword = await validatePassword(user, password);
    if (!validPassword) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

export default router;
