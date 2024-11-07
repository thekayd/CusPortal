import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../server/validators';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// User Schema
const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true, unique: true },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// User model
const UserModel = mongoose.model<User>('User', userSchema);

// Function to create a new user
export async function createUser(userData: User): Promise<User> {
  try {
    const user = new UserModel(userData);
    return await user.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Function to find a user by username and account number
export async function findUser(username: string, accountNumber: string): Promise<User | null> {
  try {
    return await UserModel.findOne({ username, accountNumber });
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

// Function to validate user password
export async function validatePassword(user: User, password: string): Promise<boolean> {
  return await bcrypt.compare(password, user.password);
}

// Payment Schema
const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, required: true },
  date: { type: Date, default: Date.now },
  accountNumber: { type: String, required: true },
});

// Payment model
const PaymentModel = mongoose.model('Payment', paymentSchema);

// Function to create a new payment
export async function createPayment(paymentData: { amount: number; currency: string; provider: string; accountNumber: string }): Promise<void> {
  try {
    const payment = new PaymentModel(paymentData);
    await payment.save();
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

// Account Information Schema
const accountInfoSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true},
  bankName: { type: String, required: true },
  swiftCode: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
// Account Information model
const AccountInfoSchema = mongoose.model('Account-Information', accountInfoSchema);

// Function to create a new account
export async function createAccount(accountData: { accountNumber: string; bankName: string; swiftCode: string }): Promise<void> {
  try {
    const account = new AccountInfoSchema(accountData);
    await account.save();
  } catch (error) {
    console.error('Error creating Account:', error);
    throw error;
  }
}

export { UserModel };
export { PaymentModel };
export { AccountInfoSchema };