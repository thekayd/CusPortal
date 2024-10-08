import { Request, Response, Router } from "express";
import { createAccount } from "../db/mongodb-integration";

const router = Router();

// Controller function to handle account information creation
router.post("/account-info", async (req: Request, res: Response) => {
  const { accountNumber, bankName, swiftCode } = req.body;

  if (!accountNumber || !bankName || !swiftCode) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await createAccount({ accountNumber, bankName, swiftCode });
    return res.status(201).json({ message: "Account information created successfully" });
  } catch (error) {
    console.error('Error creating account information:', error);
    return res.status(500).json({ message: "Error creating account information" });
  }
});

export default router;
