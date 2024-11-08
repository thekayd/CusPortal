import { EmployeeLoginForm } from "../components/EmployeeSignInForm";
import { SERVER_PATH } from "../lib/utils";
import { EmployeeResponse } from "../server/employeeController";

export async function LoginEmployee(payload: EmployeeLoginForm): Promise<EmployeeResponse> {
  // Make API Request
  const res = await fetch(`${SERVER_PATH}/api/employee/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const status = res.status;
  const data = (await res.json()) as EmployeeResponse;

  // Handle Error
  if (!res.ok || !data.employee) {
    throw new Error(`${data.message || "Something unexpected happened"} (${status})`);
  }

  return data;
}
