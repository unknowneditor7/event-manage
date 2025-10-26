'use client';
import { students, payments } from '@/lib/data';
import { StudentPaymentView } from '@/components/student/StudentPaymentView';
import { useQrCodeContext } from '@/lib/QrCodeProvider';

export default function Home() {
  const studentList = students;
  const paymentList = payments;
  const { qrCode } = useQrCodeContext();

  if (!qrCode) {
    // Handle case where image is not found, though it should be in our JSON
    return <div>Error: QR Code image not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <StudentPaymentView students={studentList} payments={paymentList} qrCodeImage={qrCode} />
    </div>
  );
}
