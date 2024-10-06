import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";

const SERVER_PATH = "https://localhost:3001";

interface RequestServiceResponse {
  status: string;
  message: string;
  username?: string;
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
  const message = (await res.json()).message || "Something unexpected happened";

  console.log("Request Service: Server Response: ", res);
  console.log("Request Service: Response Message: ", message);

  // Handle Error
  if (!res.ok) {
    //     console.log("Error:", res.status, res.statusText);
    //     console.log("Response: ", res);
    if (message === "Validation failed")
      throw new Error(`${message} Username must follow requirements. (${status})`);
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
  return { status: res.status.toString(), message: message, username: user.username };
}

export { createUser, type RequestServiceResponse, loginUser };
