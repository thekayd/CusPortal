import { Navigate } from "react-router-dom";

interface Transaction {
  id: string;
  payee: string;
  amount: number;
  swiftCode: string;
  verified: boolean;
}

export default function EmployeeDashboardPage() {
  // Temporary sample data for layout
  const transactions: Transaction[] = [
    { id: "1", payee: "John Doe", amount: 500, swiftCode: "ABC123", verified: true },
    { id: "2", payee: "Jane Smith", amount: 750, swiftCode: "DEF456", verified: false },
    { id: "3", payee: "Sam Wilson", amount: 200, swiftCode: "GHI789", verified: true },
  ];

  // Uncomment if you need to add authentication logic later
  // const { user } = useAuth();
  // if (!user) return <Navigate to="/employeesignin" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id} className="border p-4 mb-2">
            <div>Payee: {transaction.payee}</div>
            <div>Amount: {transaction.amount}</div>
            <div>SWIFT Code: {transaction.swiftCode}</div>
            <button
              disabled={transaction.verified}
              className={`mt-2 ${transaction.verified ? "text-gray-500" : "text-green-500"}`}
            >
              {transaction.verified ? "Verified" : "Verify"}
            </button>
          </li>
        ))}
      </ul>
      <button className="mt-4 bg-blue-500 text-white p-2">Submit to SWIFT</button>
    </div>
  );
}

export {};
