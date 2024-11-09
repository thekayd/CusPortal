// ../components/PaymentCards.tsx
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { useState } from "react";
import { DashboardPayment } from "../Pages/EmployeeDashboard";

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
  setIsDialogOpen,
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
            <p className="text-2xl font-bold">${transaction.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">SWIFT Code: {transaction.swiftCode}</p>
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

export function PaymentCard({
  payment: { accountNumber, amount, currency, date, id, provider, user, submitted, verified },
  onSubmit,
  handleVerify,
}: {
  payment: DashboardPayment;
  onSubmit: (id: string) => void;
  handleVerify: (id: string) => void;
}) {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card
        className={`transition-all duration-300 ${
          submitted
            ? "bg-green-50 dark:bg-green-900"
            : "hover:shadow-lg dark:hover:shadow-primary/25"
        }`}
      >
        <CardHeader>
          <CardTitle>{user.fullName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${amount.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            SWIFT Code: {provider} (NO SWIFT CODE ON PAYMENTS)
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2">
          <Button
            variant={verified ? "secondary" : "default"}
            disabled={verified || submitted}
            onClick={() => {
              setVerifyingId(id);
              setIsDialogOpen(true);
            }}
            className="w-full"
          >
            {verified ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Verified
              </>
            ) : (
              "Verify SWIFT Code"
            )}
          </Button>
          <Button
            variant="outline"
            disabled={!verified || submitted}
            onClick={() => onSubmit(id)}
            className="w-full"
          >
            {submitted ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Submitted to SWIFT
              </>
            ) : (
              "Submit to SWIFT"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog
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
            <Button
              onClick={() => {
                if (!verifyingId) return;
                handleVerify(verifyingId);
                setIsDialogOpen(false);
              }}
            >
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
