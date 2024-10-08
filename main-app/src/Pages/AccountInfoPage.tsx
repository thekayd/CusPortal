import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import useQuery from "../lib/useQuery";

export default function AccountInfoPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const query = useQuery();

  const username = query.get("username") || "";
  if (!username) return <Navigate to="/signup" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const accountData = {
      accountNumber,
      bankName,
      swiftCode,
    };

    console.log("Submitting account data:", accountData);

    try {
      const response = await fetch("/api/account-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });

      console.log("Response from server:", response); // Log the response

      if (response.ok) {
        console.log("Account info submitted successfully:", accountData);
        alert("Account information saved successfully!");
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error("Account info submission error:", errorData.message);
      }
    } catch (error) {
      console.error("Error submitting account info:", error);
    }
  };

  // Redirect after successful submission
  if (submitted) {
    return <Navigate to={`/?username=${username}`} />;
  }

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Account Information</h1>
            </div>
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200 space-y-10">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
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
                    placeholder="Enter account number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="bankName" className="block text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter bank name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="swiftCode" className="block text-gray-700">
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    id="swiftCode"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter SWIFT code"
                    required
                  />
                </div>
              </div>

              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Ready to save your account information?</p>
                <Button type="submit">Save Account Info</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
