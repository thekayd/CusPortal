import { Request, Response, Router } from "express";
import { createPayment } from "../db/mongodb-integration";

const router = Router();

// Handles payment submission
router.post("/payment", async (req: Request, res: Response) => {
  const { amount, currency, provider, accountNumber } = req.body;

  // Input validation can be added here if needed

  try {
    await createPayment({ amount, currency, provider, accountNumber });
    res.status(201).json({ message: "Payment submitted successfully" });
  } catch (error) {
    console.error('Error submitting payment:', error);
    res.status(500).json({ message: "Error submitting payment" });
  }
});

export default router;
