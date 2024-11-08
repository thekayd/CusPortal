import { Request, Response, Router } from "express";
import { handleServerError } from "./utils";
import { createAccount } from "../db/AccountModel";

const router = Router();

// Endpoint for SHOW

// Controller function to handle account information creation
router.post("/account-info", async (req: Request, res: Response) => {
  const { accountNumber, bankName, swiftCode } = req.body;

  if (!accountNumber || !bankName || !swiftCode) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    await createAccount({ accountNumber, bankName, swiftCode });
    res.status(201).json({ message: "Account information created successfully" });
  } catch (error) {
    handleServerError(error, res, "account-info", "create");
    return;
  }
});

export default router;
