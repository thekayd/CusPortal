import mongoose from "mongoose";

import { z } from "zod";
import { handleMongoError } from "../server/utils";

export const MODEL = "Account-Info" as const;

export const AccountSchema = z.object({
  accountNumber: z.string().nonempty(),
  bankName: z.string().nonempty(),
  swiftCode: z.string().nonempty(),
  date: z.date().optional(),
});
export type AccountInfo = z.infer<typeof AccountSchema>;

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

export async function SelectAccount(selectPayload: Partial<AccountInfo>): Promise<AccountInfo> {
  try {
    const account = await AccountInfoSchema.findOne({ ...selectPayload });
    if (!account) {
      throw new Error("404 on Select Account");
    }
    return {
      accountNumber: account.accountNumber,
      swiftCode: account.swiftCode,
      bankName: account.bankName,
      date: account.date,
    };
  } catch (error) {
    throw handleMongoError(error, MODEL, "Select");
  }
}
