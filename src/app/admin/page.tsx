'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { payments, firestoreLogs } from '@/lib/data';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '@/lib/auth';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { useQrCodeContext } from '@/lib/QrCodeProvider';

export default function AdminPage() {
  const { isAdmin, loading } = useAuthContext();
  const router = useRouter();
  const { qrCode, setQrCode } = useQrCodeContext();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const allPayments = payments;
  
  if (!qrCode) {
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
        qrCode={qrCode}
        onQrCodeChange={setQrCode}
        firestoreLogs={firestoreLogs}
        isAdmin={isAdmin}
      />
    </div>
  );
}
