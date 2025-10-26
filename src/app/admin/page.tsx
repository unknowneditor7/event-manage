'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { payments, firestoreLogs } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'admin@example.com';

export default function AdminPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const allPayments = payments;
  const qrCodeImage = PlaceHolderImages.find((img) => img.id === 'qr-code-1');

  if (!qrCodeImage) {
    return <div>Error: QR Code image not found.</div>;
  }
  
  const isAdmin = user?.email === ADMIN_EMAIL;

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
        isAdmin={isAdmin}
      />
    </div>
  );
}
