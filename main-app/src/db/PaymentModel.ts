import mongoose from "mongoose";
import { z } from "zod";
import { handleMongoError } from "../server/utils";

const MODEL = "Payment";

const currencies = ["USD", "EUR", "GBP", "ZAR"] as const;
export type Currencies = "USD" | "EUR" | "GBP" | "ZAR";

const PaymentSchema = z.object({
  id: z.string(),
  amount: z.number().positive(),
  currency: z.enum(currencies),
  provider: z.string().min(3),
  date: z.date(),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
});
export type Payment = z.infer<typeof PaymentSchema>;

export const PaymentPayloadSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(currencies),
  provider: z.string().min(3),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
});
export type PaymentPayload = z.infer<typeof PaymentPayloadSchema>;

// Payment Schema Mongoose Model
const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, required: true },
  date: { type: Date, default: Date.now },
  accountNumber: { type: String, required: true },
});

// Payment model
const PaymentModel = mongoose.model("Payment", paymentSchema);

// Function to create a new payment
export async function InsertPayment(payload: PaymentPayload): Promise<void> {
  try {
    const payment = new PaymentModel(payload);
    await payment.save();
  } catch (error) {
    throw handleMongoError(error, MODEL, "Insert");
  }
}

// Function to update a payment
export async function UpdatePayment(selectPayload: Payment, payload: Payment): Promise<Payment> {
  try {
    const payment = await PaymentModel.findOneAndUpdate({ ...selectPayload }, payload, {
      new: true,
    });
    if (!payment) {
      throw new Error("404 on Update Payment");
    }
    return {
      id: payment.id,
      amount: payment.amount,
      accountNumber: payment.accountNumber,
      currency: payment.currency as Currencies,
      date: payment.date,
      provider: payment.provider,
    };
  } catch (error) {
    throw handleMongoError(error, MODEL, "Update");
  }
}

// Function to Select payment
export async function SelectPayment(selectPayload: Partial<Payment>): Promise<Payment> {
  try {
    const payment = await PaymentModel.findOne({ ...selectPayload });
    if (!payment) {
      throw new Error("404 on Select Payment");
    }
    return {
      id: payment.id,
      amount: payment.amount,
      accountNumber: payment.accountNumber,
      currency: payment.currency as Currencies,
      date: payment.date,
      provider: payment.provider,
    };
  } catch (error) {
    throw handleMongoError(error, MODEL, "Select");
  }
}

// Function to get All paymenets
export async function GetAllPayments(): Promise<Payment[]> {
  try {
    const payments: Payment[] = [];
    const resPayments = await PaymentModel.find();
    if (!resPayments) {
      throw new Error("404 on Select Payment");
    }

    resPayments.forEach((payment) => {
      payments.push({
        id: payment.id,
        amount: payment.amount,
        accountNumber: payment.accountNumber,
        currency: payment.currency as Currencies,
        date: payment.date,
        provider: payment.provider,
      });
    });

    return payments;
  } catch (error) {
    throw handleMongoError(error, MODEL, "Select");
  }
}
