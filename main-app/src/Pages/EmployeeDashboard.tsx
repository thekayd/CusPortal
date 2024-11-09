// EmployeeDashboardPage.tsx

"use client";

import { useEffect, useState } from "react";
import { useToast } from "../components/ui/useToast";
import { PaymentCard } from "../components/PaymentCards";
import { GetPayments } from "../services/PaymentsRequest";
import { Payment } from "../db/PaymentModel";
import { toast } from "sonner";
import { DetailedPayment, PaymentResponse } from "../server/paymentController";

// Combination type of a Payment, User and additional fields
export type DashboardPayment = DetailedPayment & { verified: boolean; submitted: boolean };

export default function EmployeeDashboardPage() {
  // const [transactions, setTransactions] = useState<Transaction[]>([
  //   {
  //     id: "1",
  //     payee: "John Doe",
  //     amount: 500,
  //     swiftCode: "ABC123",
  //     verified: false,
  //     submitted: false,
  //   },
  //   {
  //     id: "2",
  //     payee: "Jane Smith",
  //     amount: 750,
  //     swiftCode: "DEF456",
  //     verified: false,
  //     submitted: false,
  //   },
  //   {
  //     id: "3",
  //     payee: "Sam Wilson",
  //     amount: 200,
  //     swiftCode: "GHI789",
  //     verified: false,
  //     submitted: false,
  //   },
  // ]);

  const [payments, setPayments] = useState<DashboardPayment[]>([]);

  // const [verifyingId, setVerifyingId] = useState<string | null>(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const { showToast } = useToast();

  // Fetches Payments from the server
  useEffect(() => {
    toast.promise(GetPayments(), {
      loading: "Fetching Payments, please wait...",
      success: (res: PaymentResponse) => {
        if (!res.payments) return "Failed to fetch Payments. Please try again.";

        const payments = res.payments.map((payment) => ({
          ...payment,
          verified: false,
          submitted: false,
        }));

        setPayments(payments);
        return "Payments fetched successfully!";
      },
      error: (error: Error) => `Error: ${error.message}. Please try again.`,
    });
  }, []);

  const handleVerify = (id: string) => {
    setPayments((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, verified: true } : transaction
      )
    );
    // setVerifyingId(null);
    // setIsDialogOpen(false);
    toast.success("SWIFT Code Verified");
  };

  const handleSubmit = (id: string) => {
    setPayments((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, submitted: true } : transaction
      )
    );
    toast.success("Account Submitted");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {payments.map((payment) => (
          <PaymentCard
            key={payment.id}
            onSubmit={handleSubmit}
            handleVerify={handleVerify}
            payment={payment}
          />
        ))}
      </div>
      {/* <PaymentCards
        transactions={transactions}
        onVerify={(id) => handleVerify(id)}
        onSubmit={(id) => handleSubmit(id)}
        setVerifyingId={setVerifyingId}
        setIsDialogOpen={setIsDialogOpen}
      /> */}

      {/* <Dialog
        open={isDialogOpen}
        onOpenChange={(isOpen: boolean | ((prevState: boolean) => boolean)) =>
          setIsDialogOpen(isOpen)
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify SWIFT Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this SWIFT code? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => verifyingId && handleVerify(verifyingId)}>Verify</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
