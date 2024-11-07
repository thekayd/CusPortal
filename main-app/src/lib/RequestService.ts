import { SERVER_PATH } from "./utils";

export interface RequestServiceResponse {
  status: string;
  message: string;
  username?: string;
  empID?: string;
}

export async function verifyEmployeeLogin(values: {
  empID: string;
  password: string;
}): Promise<RequestServiceResponse> {
  const res = await fetch(`${SERVER_PATH}/api/employeeLogin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });

  const status = res.status.toString();
  const message = (await res.json()).message || "Something unexpected happened";

  if (!res.ok) {
    throw new Error(`${message} (${status})`);
  }

  const data = await res.json();
  return { status: status, message: message, empID: data.empID };
}
