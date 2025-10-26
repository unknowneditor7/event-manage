'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import type { Payment } from '@/lib/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updatePaymentStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/lib/auth';
import { usePaymentContext } from '@/lib/PaymentProvider';

function SubmitButton({ payment }: { payment: Payment }) {
  const { pending } = useFormStatus();
  return (
    <Button
      size="sm"
      type="submit"
      disabled={pending}
      variant={payment.status === 'completed' ? 'secondary' : 'default'}
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : payment.status === 'completed' ? (
        'Mark as Pending'
      ) : (
        'Mark as Complete'
      )}
    </Button>
  );
}

export default function PaymentStatusTable({ payments }: { payments: Payment[] }) {
  const { toast } = useToast();
  const { isAdmin } = useAuthContext();
  const { updatePayment, paymentSettings } = usePaymentContext();
  
  const onAction = async (prevState: { status: string; message: string; }, formData: FormData) => {
    const result = await updatePaymentStatus(prevState, formData);
    if (result.status === 'success' && result.paymentId && result.newStatus) {
      toast({ title: "Success", description: result.message });
      updatePayment(result.paymentId, result.newStatus);
    } else if (result.status === 'error') {
      toast({ variant: 'destructive', title: "Error", description: result.message });
    }
    return result;
  }

  const [state, formAction] = useActionState(onAction, { status: 'idle', message: '' });

  const totalCollected = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpected = payments.length * paymentSettings.amount;
  const remainingAmount = totalExpected - totalCollected;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline">Payment Status</CardTitle>
          <div className="grid grid-cols-2 gap-4 text-right">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold font-headline">₹{totalCollected.toFixed(2)}</p>
            </div>
             <div>
              <p className="text-sm font-medium text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold font-headline text-destructive">₹{remainingAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="transition-all" data-status={payment.status}>
                <TableCell className="font-medium">{payment.studentName}</TableCell>
                <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={payment.status === 'completed' ? 'secondary' : 'default'} className="bg-opacity-20 border-opacity-40">
                    {payment.status === 'completed' ? (
                      <CheckCircle className="mr-2 text-green-400" />
                    ) : (
                      <Clock className="mr-2 text-yellow-400" />
                    )}
                    <span className="capitalize">{payment.status}</span>
                  </Badge>
                </TableCell>
                <TableCell>{new Date(payment.timestamp).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {isAdmin ? (
                     <form action={formAction}>
                        <input type="hidden" name="paymentId" value={payment.id} />
                        <input type="hidden" name="currentStatus" value={payment.status} />
                        <SubmitButton payment={payment} />
                    </form>
                  ) : (
                    <span className="text-sm text-muted-foreground capitalize">{payment.status}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
