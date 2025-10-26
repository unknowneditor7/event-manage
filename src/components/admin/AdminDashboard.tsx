'use client';

import type { Payment } from '@/lib/definitions';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentStatusTable from './PaymentStatusTable';
import QrCodeManager from './QrCodeManager';
import DataIntegrityChecker from './DataIntegrityChecker';
import { useState } from 'react';

interface AdminDashboardProps {
  initialPayments: Payment[];
  initialQrCode: ImagePlaceholder;
  firestoreLogs: string;
}

export default function AdminDashboard({
  initialPayments,
  initialQrCode,
  firestoreLogs,
}: AdminDashboardProps) {
    const [payments, setPayments] = useState<Payment[]>(initialPayments);

    const handlePaymentUpdate = (updatedPaymentId: string) => {
        setPayments(prevPayments => prevPayments.map(p => 
            p.id === updatedPaymentId ? { ...p, status: 'completed' } : p
        ));
    };

  return (
    <Tabs defaultValue="status">
      <TabsList className="grid w-full grid-cols-1 sm:w-auto sm:grid-cols-3 mb-4">
        <TabsTrigger value="status">Payment Status</TabsTrigger>
        <TabsTrigger value="qr">QR Management</TabsTrigger>
        <TabsTrigger value="integrity">Data Integrity</TabsTrigger>
      </TabsList>

      <TabsContent value="status">
        <PaymentStatusTable payments={payments} onPaymentUpdate={handlePaymentUpdate} />
      </TabsContent>

      <TabsContent value="qr">
        <QrCodeManager initialQrCode={initialQrCode} />
      </TabsContent>

      <TabsContent value="integrity">
        <DataIntegrityChecker logs={firestoreLogs} />
      </TabsContent>
    </Tabs>
  );
}
