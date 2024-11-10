import { PaymentPayload } from "../db/PaymentModel";
import { SERVER_PATH } from "../lib/utils";
import { PaymentResponse } from "../server/paymentController";

// Handles making a Create Payment request
export async function CreatePayment(payload: PaymentPayload): Promise<PaymentResponse> {
  // Make API Request
  const res = await fetch(`${SERVER_PATH}/api/payment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const status = res.status;
  const data = (await res.json()) as PaymentResponse;

  // Handle Error
  if (!res.ok) {
    throw new Error(`${data.message || "Something unexpected happened"} (${status})`);
  }

  return data;
}

export async function GetPayments(): Promise<PaymentResponse> {
  // Make API Request
  const res = await fetch(`${SERVER_PATH}/api/payment/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const status = res.status;
  const data = (await res.json()) as PaymentResponse;

  // Handle Error
  if (!res.ok) {
    throw new Error(`${data.message || "Something unexpected happened"} (${status})`);
  }

  return data;
}

// Handles making a Fetching a single Payment
export async function ShowPayment(paymentId: string): Promise<PaymentResponse> {
  // Make API Request
  const res = await fetch(`${SERVER_PATH}/api/payment/${paymentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const status = res.status;
  const data = (await res.json()) as PaymentResponse;

  // Handle Error
  if (!res.ok) {
    throw new Error(`${data.message || "Something unexpected happened"} (${status})`);
  }

  return data;
}
