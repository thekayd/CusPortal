// ../components/PaymentCards.tsx
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface Transaction {
  id: string;
  payee: string;
  amount: number;
  swiftCode: string;
  verified: boolean;
  submitted: boolean;
}

interface PaymentCardsProps {
  transactions: Transaction[];
  onVerify: (id: string) => void;
  onSubmit: (id: string) => void;
  setVerifyingId: (id: string | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
}

export default function PaymentCards({
  transactions,
  onVerify,
  onSubmit,
  setVerifyingId,
  setIsDialogOpen
}: PaymentCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {transactions.map((transaction) => (
        <Card
          key={transaction.id}
          className={`transition-all duration-300 ${
            transaction.submitted
              ? "bg-green-50 dark:bg-green-900"
              : "hover:shadow-lg dark:hover:shadow-primary/25"
          }`}
        >
          <CardHeader>
            <CardTitle>{transaction.payee}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${transaction.amount.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              SWIFT Code: {transaction.swiftCode}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-2">
            <Button
              variant={transaction.verified ? "secondary" : "default"}
              disabled={transaction.verified || transaction.submitted}
              onClick={() => {
                setVerifyingId(transaction.id);
                setIsDialogOpen(true);
              }}
              className="w-full"
            >
              {transaction.verified ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Verified
                </>
              ) : (
                "Verify SWIFT Code"
              )}
            </Button>
            <Button
              variant="outline"
              disabled={!transaction.verified || transaction.submitted}
              onClick={() => onSubmit(transaction.id)}
              className="w-full"
            >
              {transaction.submitted ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Submitted to SWIFT
                </>
              ) : (
                "Submit to SWIFT"
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}