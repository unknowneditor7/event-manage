'use client';

import { useState, useEffect } from 'react';
import type { Student, Payment } from '@/lib/definitions';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '../ui/badge';
import { CheckCircle, Clock, Loader2, Download } from 'lucide-react';
import { usePaymentContext } from '@/lib/PaymentProvider';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQrCodeContext } from '@/lib/QrCodeProvider';
import { cn } from '@/lib/utils';
import { useEventNameContext } from '@/lib/EventNameProvider';
import { useAuthContext } from '@/lib/auth';

interface StudentPaymentViewProps {
  students: Student[];
}

export function StudentPaymentView({
  students,
}: StudentPaymentViewProps) {
  const { payments, updatePayment, paymentSettings } = usePaymentContext();
  const { eventName } = useEventNameContext();
  const { qrCode } = useQrCodeContext();
  const { isAdmin } = useAuthContext();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const paidStudents = payments.filter(p => p.status === 'completed');
  const pendingStudents = payments.filter(p => p.status === 'pending');

  const totalCollected = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalExpected = students.length * paymentSettings.amount;
  const remainingAmount = totalExpected - totalCollected;

  const handleConfirmPayment = () => {
    if (!selectedStudentId) {
        toast({
            variant: "destructive",
            title: "No student selected",
            description: "Please select your name before confirming payment.",
        });
        return;
    }

    const paymentToUpdate = payments.find(p => p.studentId === selectedStudentId);
    if (paymentToUpdate && paymentToUpdate.status === 'pending') {
        setIsPaying(true);
        // Simulate a delay for payment processing
        setTimeout(() => {
            updatePayment(paymentToUpdate.id, 'completed');
            toast({
                title: "Payment Successful!",
                description: "Your payment has been marked as completed.",
            });
            setIsPaying(false);
        }, 1500);
    } else if (paymentToUpdate?.status === 'completed') {
         toast({
            variant: "default",
            title: "Already Paid",
            description: "This student's payment is already marked as completed.",
        });
    }
  };

  const handleDownloadQr = async () => {
    try {
      // For cross-origin images, we need to fetch them first.
      const response = await fetch(qrCode.imageUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `festpay-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
       console.error("QR Code download failed:", error);
       toast({
         variant: 'destructive',
         title: 'Download Failed',
         description: 'Could not download the QR code image. Please try again or take a screenshot.',
       });
    }
  };


  const selectedStudentPayment = payments.find(p => p.studentId === selectedStudentId);
  const CREATOR_NAME = 'Vishwa S';

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="flex justify-center">
        <Card className="w-full max-w-md shadow-lg shadow-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Pay Your Fee for {eventName}</CardTitle>
            <CardDescription>
              Select your name, scan the QR code to pay ₹{paymentSettings.amount.toFixed(2)}, then confirm.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-full space-y-2">
              <Label htmlFor="student-select">Select Your Name</Label>
              <Select onValueChange={setSelectedStudentId} value={selectedStudentId || ''}>
                <SelectTrigger id="student-select" className="w-full">
                  <SelectValue placeholder="-- Please select your name --" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <Image
                src={qrCode.imageUrl}
                alt={qrCode.description}
                data-ai-hint={qrCode.imageHint}
                width={300}
                height={300}
                className="rounded-md"
              />
            </div>
            
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button onClick={handleDownloadQr} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download QR
                </Button>
                <Button 
                    onClick={handleConfirmPayment} 
                    disabled={!selectedStudentId || isPaying || selectedStudentPayment?.status === 'completed'} 
                >
                    {isPaying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {selectedStudentPayment?.status === 'completed' ? 'Payment Completed' : 'Confirm Payment'}
                </Button>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              After paying, click the confirm button above.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-md mx-auto">
       {isClient && (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                      <CardTitle className='font-headline'>Payment Status</CardTitle>
                      <CardDescription>Status of all student payments.</CardDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-left sm:text-right w-full sm:w-auto">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Collected</p>
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
                <Accordion type="multiple" defaultValue={['paid', 'pending']} className="w-full">
                    <AccordionItem value="paid">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <h3 className="font-semibold">Paid ({paidStudents.length})</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-2 pt-2">
                                {paidStudents.map(p => (
                                    <li key={p.id} className={cn("flex justify-between items-center p-2 rounded-md bg-muted/50", p.studentName === CREATOR_NAME && 'text-accent font-bold')}>
                                        <span>{p.studentName}</span>
                                        <Badge variant="secondary">Completed</Badge>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="pending">
                        <AccordionTrigger>
                             <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-yellow-400" />
                                <h3 className="font-semibold">Pending ({pendingStudents.length})</h3>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-2 pt-2">
                                {pendingStudents.map(p => (
                                    <li key={p.id} className={cn("flex justify-between items-center p-2 rounded-md bg-muted/50", p.studentName === CREATOR_NAME && 'text-accent font-bold')}>
                                        <span>{p.studentName}</span>
                                        <Badge variant="default">Pending</Badge>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
