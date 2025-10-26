'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
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

function SubmitButton({ payment }: { payment: Payment }) {
  const { pending } = useFormStatus();
  return (
    <Button size="sm" type="submit" disabled={pending || payment.status === 'completed'}>
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        'Mark as Complete'
      )}
    </Button>
  );
}

export default function PaymentStatusTable({ payments, onPaymentUpdate }: { payments: Payment[], onPaymentUpdate: (paymentId: string) => void }) {
  const { toast } = useToast();
  const [state, formAction] = useFormState(updatePaymentStatus, { status: 'idle', message: '' });

  useEffect(() => {
    if (state.status === 'success') {
      toast({ title: "Success", description: state.message });
      const paymentId = state.message.split(' ')[1]; // Get ID from message "Payment [id] marked..."
      if (paymentId) onPaymentUpdate(paymentId);
    } else if (state.status === 'error') {
      toast({ variant: 'destructive', title: "Error", description: state.message });
    }
  }, [state, toast, onPaymentUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Payment Status</CardTitle>
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
                  {payment.status === 'pending' ? (
                     <form action={formAction}>
                        <input type="hidden" name="paymentId" value={payment.id} />
                        <SubmitButton payment={payment} />
                    </form>
                  ) : (
                    <span className="text-sm text-muted-foreground">Completed</span>
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
