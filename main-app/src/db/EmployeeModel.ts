import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Employee } from "../server/validators";
import { handleMongoError } from "../server/utils";

const MODEL = "EmployeeModel" as const;

// ID: 004
// Passowrd: test@0111

// MongoDB Employee Schema
const EmployeeSchema = new mongoose.Schema<Employee>({
  name: { type: String, required: true },
  empID: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
EmployeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create an Employee model based on the schema
const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

// Handles Inserting Employee into DB
export async function InsertEmployee(employee: Employee) {
  try {
    // Create a new employee document with hashed password
    const newEmployee = new EmployeeModel(employee);
    await newEmployee.save();
    console.log("Employee added:", newEmployee);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Handles Updating Employee into DB
export async function UpdateEmployee(employee: Employee) {
  try {
    // Create a new employee document with hashed password
    const newEmployee = new EmployeeModel(employee);
    await newEmployee.save();
    console.log("Employee added:", newEmployee);
  } catch (error) {
    throw handleMongoError(error, MODEL, "Update");
  }
}

export async function SelectEmployee(selectPayload: Partial<Employee>): Promise<Employee> {
  try {
    const employee = await EmployeeModel.findOne({ ...selectPayload });
    if (!employee) {
      throw new Error("404 on Select Employee");
    }
    return {
      email: employee.email,
      empID: employee.empID,
      name: employee.name,
      password: employee.password,
    };
  } catch (error) {
    throw handleMongoError(error, MODEL, "Select");
  }
}
