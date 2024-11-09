import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import useQuery from "../lib/useQuery";
import { toast } from "sonner";
import { CreateAccount } from "../services/AccountRequest";

export default function AccountInfoPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const query = useQuery();

  const username = query.get("username") || "";
  if (!username) return <Navigate to="/signup" />;

  // Regex patterns
  const accountNumberPattern = /^\d{10}$/; // 10 digits
  const swiftCodePattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/; // Valid SWIFT code

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!accountNumberPattern.test(accountNumber)) {
      setErrorMessage("Account number must be exactly 10 digits.");
      return;
    }
    if (!swiftCodePattern.test(swiftCode)) {
      setErrorMessage("Invalid SWIFT code format.");
      return;
    }

    const accountData = {
      accountNumber,
      bankName,
      swiftCode,
    };

    console.log("Submitting account data:", accountData);
    toast.promise(CreateAccount(accountData), {
      loading: "Creating account, please wait...",
      success: (res: any) => {
        console.log("Account created Res:", res);
        setSubmitted(true);
        return `Account created successfully! ${res.message}`;
      },
      error: (error: any) => {
        console.error("Error creating account:", error);
        return `Error creating account: ${error.message}`;
      },
    });
  };

  // Redirect after successful submission
  if (submitted) {
    return <Navigate to={`/?username=${username}`} />;
  }

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
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

                {/* Display error message if any */}
                {errorMessage && <div className="text-red-600">{errorMessage}</div>}
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
