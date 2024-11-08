import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../server/validators";

// User Schema
export const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// User model
const UserModel = mongoose.model<User>("User", userSchema);

// Function to create a new user
export async function createUser(userData: User): Promise<User> {
  try {
    const user = new UserModel(userData);
    return await user.save();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Function to find a user by username and account number
export async function SelectUser(selectPayload: Partial<User>): Promise<User> {
  try {
    const user = await UserModel.findOne({ ...selectPayload });
    if (!user) {
      throw new Error("404 on Select User");
    }

    return { ...user };
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
}
