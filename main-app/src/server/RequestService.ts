import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";

const SERVER_PATH = "https://localhost:3001";

interface RequestServiceResponse {
  status: string;
  message: string;
}

async function createUser(user: SignUpForm): Promise<RequestServiceResponse> {
  // Make API Request
  const res = await fetch(`${SERVER_PATH}/api/register`, {
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
    // console.log("Error:", res.status, res.statusText);
    // console.log("Response: ", res);
    throw new Error(`${message} (${status})`);
  }

  //   console.log(res);
  //   console.log("Body: ", await res.json());
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
    // console.log("Error:", res.status, res.statusText);
    // console.log("Response: ", res);
    throw new Error(`${message} (${status})`);
  }

  //   console.log(res);
  //   console.log("Body: ", await res.json());
  return { status: res.status.toString(), message: message };
}

export { createUser, type RequestServiceResponse, loginUser };
