import { body } from "express-validator";
import { z } from "zod";

// Schemas
const userSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username must contain only alphanumeric characters.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  email: z
    .string()
    .email({
      message: "Invalid email format.",
    })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email format.",
    }),
  fullName: z
    .string()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Full name must contain only letters and spaces.",
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
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Username must contain only alphanumeric characters.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  accountNumber: z.string().regex(/^\d{10}$/, {
    message: "Account number must be 10 digits.",
  }),
});

// Employee
export const employeeSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Full name must contain only letters and spaces.",
    }),
  empID: z.string(), // TODO: Add EmployeeID Validation
  email: z
    .string()
    .email({
      message: "Invalid email format.",
    })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email format.",
    }),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/, {
      message: "Invalid password format",
    }),
});
export type Employee = z.infer<typeof employeeSchema>;

export const EmployeeLoginFormSchema = z.object({
  empID: z.string().min(3, { message: "Employee ID is required." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.enum(["USD", "EUR", "GBP", "ZAR"]),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
  swiftCode: z.string().regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Invalid SWIFT code"),
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
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Username must be alphanumeric and cannot contain spaces or special characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ min: 5, max: 32 })
    .withMessage("Email must be between 5 and 32 characters")
    .isString()
    .withMessage("Email must be a string")
    .isEmail()
    .withMessage("Invalid email format")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
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
    .withMessage("Full name must be a string")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name must contain only letters and spaces"),
  body("idNumber")
    .notEmpty()
    .withMessage("ID number is required")
    .isLength({ min: 13, max: 13 })
    .withMessage("ID number must be exactly 13 digits")
    .isNumeric()
    .withMessage("ID number must contain only digits")
    .matches(/^\d{13}$/)
    .withMessage("ID number must be exactly 13 digits"),
  body("accountNumber")
    .notEmpty()
    .withMessage("Account number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Account number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Account number must contain only digits")
    .matches(/^\d{10}$/)
    .withMessage("Account number must be exactly 10 digits"),
];

export { validateUserInput, userSchema, loginPayload, type User };
