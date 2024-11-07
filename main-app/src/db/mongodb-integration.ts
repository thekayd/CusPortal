import mongoose from "mongoose";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in the environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

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

// Account Information Schema
const accountInfoSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  swiftCode: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
// Account Information model
const AccountInfoSchema = mongoose.model("Account-Information", accountInfoSchema);

// Function to create a new account
export async function createAccount(accountData: {
  accountNumber: string;
  bankName: string;
  swiftCode: string;
}): Promise<void> {
  try {
    const account = new AccountInfoSchema(accountData);
    await account.save();
  } catch (error) {
    console.error("Error creating Account:", error);
    throw error;
  }
}

export { PaymentModel };
export { AccountInfoSchema };
