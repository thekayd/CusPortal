import { Request, Response, Router } from "express";
import { handleServerError, validatePassword } from "./utils";
import { EmployeeLoginFormSchema } from "../components/EmployeeSignInForm";
import { SelectEmployee } from "../db/EmployeeModel";
import { Employee } from "./validators";

export interface EmployeeResponse {
  status: string;
  message: string;
  employee: Employee;
}

const router = Router();

// Handles Login of existing users
router.post("/employee/login", async (req: Request, res: Response) => {
  // Validate & type values via Zod schema
  const safePayload = EmployeeLoginFormSchema.safeParse({ ...req.body });
  if (safePayload.error) {
    res.status(400).json({ message: safePayload.error.message });
    return;
  }
  const { empID, password } = safePayload.data;

  try {
    // Find employee
    const employee = await SelectEmployee({ empID });
    if (!employee) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Check password
    const validPassword = await validatePassword(employee.password, password);
    if (!validPassword) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.json({
      status: "200",
      message: "Logged in successfully",
      employee: employee,
    } as EmployeeResponse);
  } catch (error) {
    handleServerError(error, res, "Employee", "login");
    return;
  }
});

export default router;
