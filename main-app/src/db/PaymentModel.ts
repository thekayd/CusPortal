import mongoose from "mongoose";

// Payment Schema
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
export async function createPayment(paymentData: {
  amount: number;
  currency: string;
  provider: string;
  accountNumber: string;
}): Promise<void> {
  try {
    const payment = new PaymentModel(paymentData);
    await payment.save();
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}
