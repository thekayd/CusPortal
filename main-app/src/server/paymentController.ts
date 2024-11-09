import { Request, Response, Router } from "express";
import {
  GetAllPayments,
  InsertPayment,
  Payment,
  PaymentPayloadSchema,
  SelectPayment,
} from "../db/PaymentModel";
import { SelectUser } from "../db/UserModel";
import { User } from "./validators";
import { handleServerError } from "./utils";
import { AccountInfo, SelectAccount } from "../db/AccountModel";

export type DetailedPayment = Payment & { accountInfo: AccountInfo; user: Partial<User> };
export interface PaymentResponse {
  status: string;
  message: string;
  payments: DetailedPayment[];
}

const CONTROLLER = "Payment";

const router = Router();

// GET ALL (index)
router.get("/payment/all", async (req: Request, res: Response) => {
  let detailedPayments: DetailedPayment[] = [];

  try {
    const payments = await GetAllPayments();
    console.log("Payments: ", payments);

    // Find user's that made the payments
    detailedPayments = await Promise.all(
      payments.map(async (payment) => {
        try {
          const account = await SelectAccount({ accountNumber: payment.accountNumber });
          const user = await SelectUser({ accountNumber: payment.accountNumber });
          console.log("Found account: ", account);
          return { ...payment, accountInfo: { ...account }, user: { ...user, password: "" } };
        } catch (error: any) {
          return {
            ...payment,
            accountInfo: { accountNumber: "", swiftCode: "", bankName: "", date: new Date() },
            user: { username: "", password: "", accountNumber: "" },
          };
          // throw new Error(`Error finding account for payment ${payment.id}: ${error.message}`);
        }
      })
    );

    console.log("Completed Payments: ", detailedPayments);

    res.status(200).json({
      status: "200",
      message: "Payments collected",
      payments: detailedPayments,
    } as PaymentResponse);
  } catch (error) {
    console.log("Couldn't find user: ", error);
    handleServerError(error, res, CONTROLLER, "index");
    return;
  }
});

// GET Specific (show)
router.get("/payment/:id", async (req: Request, res: Response) => {
  const paymentId = req.params.id;
  if (!paymentId) {
    res.status(400).json({ message: "No username provided" });
    return;
  }

  try {
    const payment = await SelectPayment({ id: paymentId });
    const account = await SelectAccount({ accountNumber: payment.accountNumber });
    const user = await SelectUser({ accountNumber: payment.accountNumber });

    res.status(200).json({
      status: "200",
      message: "Payment Found",
      payments: [{ ...payment, accountInfo: account, user: { ...user, password: "" } }],
    } as PaymentResponse);
  } catch (error) {
    handleServerError(error, res, CONTROLLER, "Show");
  }
});

// Create Payment
router.post("/payment", async (req: Request, res: Response) => {
  // Validate & type values via Zod schema
  const safePayload = PaymentPayloadSchema.safeParse({ ...req.body });
  if (safePayload.error) {
    res.status(400).json({ message: safePayload.error.message });
    return;
  }
  const { accountNumber, amount, currency, provider } = safePayload.data;

  // Input validation can be added here if needed
  try {
    await InsertPayment({ amount, currency, provider, accountNumber });
    res.status(201).json({ message: "Payment submitted successfully" });
  } catch (error) {
    console.error("Error submitting payment:", error);
    res.status(500).json({ message: "Error submitting payment" });
  }
});

// PUT/POST (update)
// router.post("/payment/:id", async (req: Request, res: Response) => {

// });

export default router;
