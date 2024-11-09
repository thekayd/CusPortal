import { EmployeeLoginForm } from "../components/EmployeeSignInForm";
import { SERVER_PATH } from "../lib/utils";
import { EmployeeResponse } from "../server/employeeController";

interface AccountPayload {
  accountNumber: string;
  bankName: string;
  swiftCode: string;
}

export async function CreateAccount(payload: AccountPayload): Promise<EmployeeResponse> {
  // Make API Request
  const res = await fetch(`${SERVER_PATH}/api/account-info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const status = res.status;
  const data = await res.json();

  // Handle Error
  if (!res.ok) {
    throw new Error(`${data.message || "Something unexpected happened"} (${status})`);
  }

  return data;
}
