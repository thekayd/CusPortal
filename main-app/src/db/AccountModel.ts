import mongoose from "mongoose";

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
