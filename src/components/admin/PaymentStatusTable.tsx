'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle, Clock, Loader2, FileDown } from 'lucide-react';
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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useEventNameContext } from '@/lib/EventNameProvider';

// Extend the window interface for jspdf-autotable
declare global {
  interface Window {
    jsPDF: typeof jsPDF;
  }
}

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}


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
  const { eventName } = useEventNameContext();
  
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
  const paidStudents = payments.filter((p) => p.status === 'completed');
  const pendingStudents = payments.filter((p) => p.status === 'pending');

  const generatePdf = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Title
    doc.setFontSize(20);
    doc.text(`${eventName} - Payment Report`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);


    // Summary
    doc.setFontSize(12);
    doc.text('Summary', 14, 40);
    const summaryData = [
        ['Total Students', payments.length.toString()],
        ['Payment Amount per Student', `₹${paymentSettings.amount.toFixed(2)}`],
        ['Total Expected', `₹${totalExpected.toFixed(2)}`],
        ['Total Collected', `₹${totalCollected.toFixed(2)}`],
        ['Total Remaining', `₹${remainingAmount.toFixed(2)}`],
        ['Paid Students', paidStudents.length.toString()],
        ['Pending Students', pendingStudents.length.toString()],
    ];
    doc.autoTable({
      startY: 45,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [22, 163, 74] },
    });
    
    let finalY = (doc as any).lastAutoTable.finalY || 10;

    // Paid Students Table
    if (paidStudents.length > 0) {
      doc.setFontSize(12);
      doc.text('Paid Students', 14, finalY + 15);
      const paidData = paidStudents.map(p => [
          p.studentName, 
          `₹${p.amount.toFixed(2)}`, 
          new Date(p.timestamp).toLocaleDateString()
        ]);
      doc.autoTable({
        startY: finalY + 20,
        head: [['Student Name', 'Amount', 'Date']],
        body: paidData,
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
      });
      finalY = (doc as any).lastAutoTable.finalY;
    }

    // Pending Students Table
    if (pendingStudents.length > 0) {
      doc.setFontSize(12);
      doc.text('Pending Students', 14, finalY + 15);
      const pendingData = pendingStudents.map(p => [
        p.studentName, 
        `₹${p.amount.toFixed(2)}`
      ]);
       doc.autoTable({
        startY: finalY + 20,
        head: [['Student Name', 'Amount']],
        body: pendingData,
        theme: 'grid',
        headStyles: { fillColor: [234, 179, 8] },
      });
    }

    doc.save(`payment_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <CardTitle className="font-headline">Payment Status</CardTitle>
            <Button onClick={generatePdf} size="sm" variant="outline" disabled={!isAdmin}>
                <FileDown className="mr-2 h-4 w-4" />
                Download Report
            </Button>
          </div>
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
