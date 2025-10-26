'use client';

import type { Student } from '@/lib/definitions';
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

interface StudentPaymentViewProps {
  students: Student[];
  qrCodeImage: ImagePlaceholder;
}

export function StudentPaymentView({
  students,
  qrCodeImage,
}: StudentPaymentViewProps) {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
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
  );
}
