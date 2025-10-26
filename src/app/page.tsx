import { students } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { StudentPaymentView } from '@/components/student/StudentPaymentView';

export default function Home() {
  const studentList = students;
  const qrCodeImage = PlaceHolderImages.find((img) => img.id === 'qr-code-1');

  if (!qrCodeImage) {
    // Handle case where image is not found, though it should be in our JSON
    return <div>Error: QR Code image not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <StudentPaymentView students={studentList} qrCodeImage={qrCodeImage} />
    </div>
  );
}
