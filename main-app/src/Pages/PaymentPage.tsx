import { useState } from "react";
import { Navigate } from "react-router-dom";
import useQuery from "../lib/useQuery";
import { Button } from "../components/ui/button";

export default function PaymentPage() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [provider, setProvider] = useState("SWIFT");
  const [accountNumber, setAccountNumber] = useState("");

  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const query = useQuery();

  const username = query.get("username") || "";
  if (!username) return <Navigate to="/signup" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentDetails = {
      amount: parseFloat(amount),
      currency,
      provider,
      accountNumber
    };

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });

      if (response.ok) {
        console.log("Payment details submitted:", paymentDetails);
        alert("Payment details submitted successfully!");
        setPaymentSuccessful(true); // Mark payment as successful
      } else {
        const errorData = await response.json();
        console.error("Payment submission error:", errorData.message);
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  // Redirect to AccountInfoPage if payment is successful
  if (paymentSuccessful) {
    return <Navigate to={`/account-info?username=${username}`} replace />;
  }

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Make a Payment</h1>
            </div>
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200 space-y-10">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div>
                  <label htmlFor="amount" className="block text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="currency" className="block text-gray-700">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="ZAR">ZAR</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="provider" className="block text-gray-700">
                    Payment Provider
                  </label>
                  <select
                    id="provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="SWIFT">SWIFT</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="accountNumber" className="block text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter your account number"
                    required
                  />
                </div>
              </div>

              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Ready to proceed?</p>
                <Button type="submit">Next Step</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
