import mongoose from "mongoose";

import { z } from "zod";
import { handleMongoError } from "../server/utils";

// PLEASE NOT:
// All functions in this file & in the "/db" folder
// are used to extract the logic of Database operations.
// Almost all have an Insert/Create, and Find/Select functions.
// These functions operate similarly, therefore this file will
// contain the detailed documentation that can be carreid over to any
// other Model.

export const MODEL = "Account-Info" as const;

// Modeling the Table Schema & providing the type
export const AccountSchema = z.object({
  accountNumber: z.string().nonempty(),
  bankName: z.string().nonempty(),
  swiftCode: z.string().nonempty(),
  date: z.date().optional(),
});
export type AccountInfo = z.infer<typeof AccountSchema>;

// Defining the Mongoose Schema for the Table (Model)
const accountInfoSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  swiftCode: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const AccountInfoSchema = mongoose.model("Account-Information", accountInfoSchema);

// Handles Inserting/Creating an Account
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

// Handels Select options on the Table (Model) Schema, using a Partial (makes type fields optional) Payload
// The type annotations are used to ensure that all data is accurate, and the Client knows what to expect
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
