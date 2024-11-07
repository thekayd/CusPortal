import { LoginForm } from "../components/LoginForm";
import { SignUpFormData } from "../components/SignUpForm";

export const SERVER_PATH = "https://localhost:3001" as const;

interface RequestServiceResponse {
  status: string;
  message: string;
  username?: string;
}

// Handles making fetch request to api server
async function createUser(user: SignUpFormData): Promise<RequestServiceResponse> {
  // Make API Request
  const res = await fetch(`${SERVER_PATH}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const status = res.status.toString();
  const message = (await res.json()).message || "Something unexpected happened";

  console.log("Request Service: Server Response: ", res);
  console.log("Request Service: Response Message: ", message);

  // Handle Error
  if (!res.ok) {
    throw new Error(`${message} (${status})`);
  }

  return { status: res.status.toString(), message: message };
}

async function loginUser(user: LoginForm): Promise<RequestServiceResponse> {
  // Make API Request
  const res = await fetch(`${SERVER_PATH}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const status = res.status.toString();
  const message: string = (await res.json()).message || "Something unexpected happened";

  // Handle Error
  if (!res.ok) {
    throw new Error(`${message} (${status})`);
  }

  return { status: res.status.toString(), message: message, username: user.username };
}

export { createUser, type RequestServiceResponse, loginUser };
