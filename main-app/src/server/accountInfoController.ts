import { Request, Response, Router } from "express";
import { handleServerError } from "./utils";
import { createAccount } from "../db/AccountModel";

const router = Router();

const accountNumberPattern = /^\d{10}$/; // 10 digits
const swiftCodePattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/; // Valid SWIFT code

// CREATE Account Info
router.post("/account-info", async (req: Request, res: Response) => {
  const { accountNumber, bankName, swiftCode } = req.body;

  // Input validation
  if (
    !accountNumber ||
    !bankName ||
    !swiftCode ||
    !accountNumberPattern.test(accountNumber) ||
    !swiftCodePattern.test(swiftCode)
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    // Execute Insert opertation
    await createAccount({ accountNumber, bankName, swiftCode });
    res.status(201).json({ message: "Account information created successfully" });
  } catch (error) {
    handleServerError(error, res, "account-info", "create");
    return;
  }
});

export default router;
