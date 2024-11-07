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
    console.error("Error submitting payment:", error);
    res.status(500).json({ message: "Error submitting payment" });
  }
});

// GET ALL (index)
// router.get("/payment", async (req: Request, res: Response) => {
//   return;
// });

// CREATE (create)
// router.post("/payment/create", async (req: Request, res: Response) => {
//   return;
// });

// GET Specific (show)
// router.get("/payment/:id", async (req: Request, res: Response) => {
//   return;
// });

// PUT/POST (update)
// router.post("/payment/:id", async (req: Request, res: Response) => {
//   return;
// });

export default router;
