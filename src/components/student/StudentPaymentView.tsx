'use client';

import type { Student, Payment } from '@/lib/definitions';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
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
import { CheckCircle, Clock } from 'lucide-react';

interface StudentPaymentViewProps {
  students: Student[];
  payments: Payment[];
  qrCodeImage: ImagePlaceholder;
}

export function StudentPaymentView({
  students,
  payments,
  qrCodeImage,
}: StudentPaymentViewProps) {

  const paidStudents = payments.filter(p => p.status === 'completed');
  const pendingStudents = payments.filter(p => p.status === 'pending');

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="flex justify-center">
        <Card className="w-full max-w-md shadow-lg shadow-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Pay Your Fee</CardTitle>
            <CardDescription>
              Select your name and scan the QR code to pay ₹240.00
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-full space-y-2">
              <Label htmlFor="student-select">Select Your Name</Label>
              <Select>
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
                src={qrCodeImage.imageUrl}
                alt={qrCodeImage.description}
                data-ai-hint={qrCodeImage.imageHint}
                width={300}
                height={300}
                className="rounded-md"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan with any UPI app to complete the payment.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-md mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Payment Status</CardTitle>
                <CardDescription>Status of all student payments.</CardDescription>
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
                                    <li key={p.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
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
                                    <li key={p.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
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
      </div>
    </div>
  );
}
