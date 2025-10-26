'use client';
import { payments, firestoreLogs } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const allPayments = payments;
  const qrCodeImage = PlaceHolderImages.find((img) => img.id === 'qr-code-1');

  if (!qrCodeImage) {
    return <div>Error: QR Code image not found.</div>;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage payments, QR codes, and data integrity.</p>
      </header>
      <AdminDashboard
        initialPayments={allPayments}
        initialQrCode={qrCodeImage}
        firestoreLogs={firestoreLogs}
        isAdmin={true}
      />
    </div>
  );
}
