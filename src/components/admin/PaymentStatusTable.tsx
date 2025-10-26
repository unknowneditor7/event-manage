'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle, Clock, Loader2, FileDown, ChevronDown } from 'lucide-react';
import type { Payment } from '@/lib/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

  const [, formAction] = useActionState(onAction, { status: 'idle', message: '' });

  const totalCollected = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpected = payments.length * paymentSettings.amount;
  const remainingAmount = totalExpected - totalCollected;
  const paidStudents = payments.filter((p) => p.status === 'completed');
  const pendingStudents = payments.filter((p) => p.status === 'pending');

  const generatePdf = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const tableStartY = 55;

    doc.setFontSize(20);
    doc.text(`${eventName} - Payment Report`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    // Amount Details
    doc.setFontSize(12);
    doc.text('Amount Details', 14, 40);
    doc.autoTable({
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Students', payments.length.toString()],
        ['Payment Amount per Student', `Rs. ${paymentSettings.amount.toFixed(2)}`],
        ['Total Expected', `Rs. ${totalExpected.toFixed(2)}`],
        ['Total Collected', `Rs. ${totalCollected.toFixed(2)}`],
        ['Total Remaining', `Rs. ${remainingAmount.toFixed(2)}`],
        ['Paid Students', paidStudents.length.toString()],
        ['Pending Students', pendingStudents.length.toString()],
      ],
      theme: 'striped',
      headStyles: { fillColor: [45, 45, 45] },
    });
    
    let finalY = (doc as any).lastAutoTable.finalY || tableStartY;

    // Paid Students List
    if (paidStudents.length > 0) {
      doc.setFontSize(12);
      doc.text('Paid Students', 14, finalY + 15);
      doc.autoTable({
        startY: finalY + 20,
        head: [['Student Name', 'Amount', 'Date']],
        body: paidStudents.map(p => [
          p.studentName, 
          `Rs. ${p.amount.toFixed(2)}`, 
          new Date(p.timestamp).toLocaleDateString()
        ]),
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
      });
      finalY = (doc as any).lastAutoTable.finalY;
    }

    // Unpaid Students List
    if (pendingStudents.length > 0) {
      doc.setFontSize(12);
      doc.text('Pending Students (Unpaid)', 14, finalY + 15);
       doc.autoTable({
        startY: finalY + 20,
        head: [['Student Name', 'Amount']],
        body: pendingStudents.map(p => [
          p.studentName, 
          `Rs. ${p.amount.toFixed(2)}`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [234, 179, 8] },
      });
    }

    doc.save(`payment_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Payment Report for ${eventName}\n`;
    csvContent += `Generated on,${new Date().toLocaleDateString()}\n\n`;

    // Amount Details
    csvContent += "Amount Details\n";
    const summaryData = [
      ['Metric', 'Value'],
      ['Total Students', payments.length],
      ['Payment Amount per Student', `"${paymentSettings.amount.toFixed(2)}"`],
      ['Total Expected', `"${totalExpected.toFixed(2)}"`],
      ['Total Collected', `"${totalCollected.toFixed(2)}"`],
      ['Total Remaining', `"${remainingAmount.toFixed(2)}"`],
      ['Paid Students', paidStudents.length],
      ['Pending Students', pendingStudents.length],
    ];
    summaryData.forEach(row => { csvContent += row.join(',') + "\n"; });
    csvContent += "\n";

    // Paid Students List
    if (paidStudents.length > 0) {
      csvContent += "Paid Students\n";
      csvContent += "Student Name,Amount,Date,Status\n";
      paidStudents.forEach(p => {
        const row = [p.studentName, p.amount.toFixed(2), new Date(p.timestamp).toLocaleDateString(), p.status];
        csvContent += row.join(',') + "\n";
      });
      csvContent += "\n";
    }

    // Unpaid Students List
    if (pendingStudents.length > 0) {
      csvContent += "Pending Students (Unpaid)\n";
      csvContent += "Student Name,Amount,Status\n";
      pendingStudents.forEach(p => {
        const row = [p.studentName, p.amount.toFixed(2), p.status];
        csvContent += row.join(',') + "\n";
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payment_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <CardTitle className="font-headline">Payment Status</CardTitle>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={!isAdmin}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Report
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={generatePdf}>
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={generateCsv}>
                  Download as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

    