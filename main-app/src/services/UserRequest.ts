import { SignUpFormData } from "../components/SignUpForm";
import { UserResponse } from "../server/userController";
import { LoginForm } from "../components/LoginForm";

export async function RegisterUser(user: SignUpFormData): Promise<UserResponse> {
  // Make API Request
  const res = await fetch(`${process.env.SERVER_PATH}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const status = res.status;
  const data = (await res.json()) as UserResponse;

  console.log("Request Service: Server Response: ", res);
  console.log("Request Service: Response Message: ", data.message);

  // Handle Error
  if (!res.ok || !data?.username) {
    throw new Error(`${data.message || "Something unexpected happened"} (${status})`);
  }

  return data;
}

export async function LoginUser(user: LoginForm): Promise<UserResponse> {
  // Make API Request
  const res = await fetch(`${process.env.SERVER_PATH}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const status = res.status;
  const data = await res.json();

  // Handle Error
  if (!res.ok) {
    throw new Error(`${data.message || "Something unexpected happened"} (${status})`);
  }

  return data;
}