'use client';
import { students } from '@/lib/data';
import { StudentPaymentView } from '@/components/student/StudentPaymentView';
import { useQrCodeContext } from '@/lib/QrCodeProvider';

export default function Home() {
  const studentList = students;
  const { qrCode } = useQrCodeContext();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <StudentPaymentView students={studentList} qrCodeImage={qrCode} />
    </div>
  );
}
