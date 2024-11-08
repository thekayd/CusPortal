import { Request, Response, Router } from "express";
import { matchedData, validationResult } from "express-validator";
import { loginPayload, User, userSchema, validateUserInput } from "./validators";
import { createUser, SelectUser } from "../db/UserModel";
import { handleServerError, validatePassword } from "./utils";

const CONTROLLER = "User" as const;

export interface UserResponse {
  message: string;
  username: string;
  user?: User;
}

const router = Router();

// GET ALL (Index)
router.get("/users", async (req: Request, res: Response) => {
  return;
});

// GET Specific (Show)
router.get("/users/:username", async (req: Request, res: Response) => {
  const username = req.params.username;
  if (!username) {
    res.status(400).json({ message: "No username provided" });
    return;
  }

  try {
    const user = await SelectUser({ username });
    res.json({ message: "User found", username: username, user: user } as UserResponse);
  } catch (error) {
    handleServerError(error, res, CONTROLLER, "show");
    return;
  }
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
    const user = await createUser(userData);
    res.status(201).json({
      message: "User registered successfully",
      username: user.username,
    } as UserResponse);
    return;
  } catch (error: any) {
    handleServerError(error, res, CONTROLLER, "register");
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
    const user = await SelectUser({ username, accountNumber });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Check password
    const validPassword = await validatePassword(user.password, password);
    if (!validPassword) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.json({
      message: "Logged in successfully",
      username: user.username,
    } as UserResponse);
  } catch (error) {
    handleServerError(error, res, CONTROLLER, "login");
    return;
  }
});

export default router;
