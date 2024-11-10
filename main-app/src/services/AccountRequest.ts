import { EmployeeLoginForm } from "../components/EmployeeSignInForm";
import { SERVER_PATH } from "../lib/utils";
import { EmployeeResponse } from "../server/employeeController";

interface AccountPayload {
  accountNumber: string;
  bankName: string;
  swiftCode: string;
}

// Request Services allow the Client to make safe (error handled) requests to the Server
// This is done to abstract data fetching logic from the View

// Hanldes creating an account-info for a user
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
