'use client';

import type { Payment } from '@/lib/definitions';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentStatusTable from './PaymentStatusTable';
import QrCodeManager from './QrCodeManager';
import DataIntegrityChecker from './DataIntegrityChecker';
import { useState } from 'react';
import { Lock } from 'lucide-react';

interface AdminDashboardProps {
  initialPayments: Payment[];
  qrCode: ImagePlaceholder;
  onQrCodeChange: (newQrCode: ImagePlaceholder) => void;
  firestoreLogs: string;
  isAdmin: boolean;
}

export default function AdminDashboard({
  initialPayments,
  qrCode,
  onQrCodeChange,
  firestoreLogs,
  isAdmin,
}: AdminDashboardProps) {
    const [payments, setPayments] = useState<Payment[]>(initialPayments);

    const handlePaymentUpdate = (updatedPaymentId: string) => {
        setPayments(prevPayments => prevPayments.map(p => 
            p.id === updatedPaymentId ? { ...p, status: 'completed' } : p
        ));
    };

  return (
    <Tabs defaultValue="status">
      <TabsList className="grid w-full sm:grid-cols-3 mb-4">
        <TabsTrigger value="status">Payment Status</TabsTrigger>
        <TabsTrigger value="qr" disabled={!isAdmin}>
            <div className='flex items-center gap-2'>
                QR Management
                {!isAdmin && <Lock className="h-4 w-4" />}
            </div>
        </TabsTrigger>
        <TabsTrigger value="integrity" disabled={!isAdmin}>
            <div className='flex items-center gap-2'>
                Data Integrity
                {!isAdmin && <Lock className="h-4 w-4" />}
            </div>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="status">
        <PaymentStatusTable payments={payments} onPaymentUpdate={handlePaymentUpdate} />
      </TabsContent>

      
      <TabsContent value="qr">
        {isAdmin ? (
          <QrCodeManager qrCode={qrCode} onQrCodeChange={onQrCodeChange} />
        ) : null}
      </TabsContent>

      <TabsContent value="integrity">
        {isAdmin ? (
          <DataIntegrityChecker logs={firestoreLogs} />
        ) : null}
      </TabsContent>
      
    </Tabs>
  );
}
