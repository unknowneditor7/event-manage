'use client';
import { payments, firestoreLogs } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const allPayments = payments;
  const qrCodeImage = PlaceHolderImages.find((img) => img.id === 'qr-code-1');
  const { user, loading, claims } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; 
  }

  if (!qrCodeImage) {
    return <div>Error: QR Code image not found.</div>;
  }
  
  const isAdmin = claims?.role === 'admin';

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
