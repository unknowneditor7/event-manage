'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { firestoreLogs } from '@/lib/data';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '@/lib/auth';

export default function AdminPage() {
  const { isAdmin, loading } = useAuthContext();
  const router = useRouter();

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
  
  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage payments, QR codes, and data integrity.</p>
      </header>
      <AdminDashboard
        firestoreLogs={firestoreLogs}
        isAdmin={isAdmin}
      />
    </div>
  );
}
