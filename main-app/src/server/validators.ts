import { body } from "express-validator";
import { z } from "zod";

// Schemas
const userSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  email: z.string().email({
    message: "Invalid email format.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  idNumber: z.string().regex(/^\d{13}$/, {
    message: "ID number must be 13 digits.",
  }),
  accountNumber: z.string().regex(/^\d{10}$/, {
    message: "Account number must be 10 digits.",
  }),
});
type User = z.infer<typeof userSchema>;

const loginPayload = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  accountNumber: z.string().regex(/^\d{10}$/, {
    message: "Account number must be 10 digits.",
  }),
});

// Input validation middleware
const validateUserInput = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 5, max: 32 })
    .withMessage("Username must be between 5 and 32 characters")
    .isString()
    .withMessage("Username must be a string")
    .matches(/^[a-zA-Z0-9]+$/) // Only allows alphanumeric characters
    .withMessage("Username must be alphanumeric and cannot contain spaces or special characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ min: 5, max: 32 })
    .withMessage("Email must be between 5 and 32 characters")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isString()
    .withMessage("Password must be a string")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long, and must require at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .isString()
    .withMessage("Full name must be a string"),
  body("idNumber")
    .notEmpty()
    .withMessage("ID number is required")
    .isLength({ min: 13, max: 13 })
    .withMessage("ID number must be exactly 13 digits")
    .isNumeric()
    .withMessage("ID number must contain only digits"),
  body("accountNumber")
    .notEmpty()
    .withMessage("Account number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Account number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Account number must contain only digits"),
];

export { validateUserInput, userSchema, loginPayload, type User };
