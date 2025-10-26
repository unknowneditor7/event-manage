'use client';

import type { Payment } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentStatusTable from './PaymentStatusTable';
import QrCodeManager from './QrCodeManager';
import DataIntegrityChecker from './DataIntegrityChecker';
import { Lock } from 'lucide-react';
import { usePaymentContext } from '@/lib/PaymentProvider';

interface AdminDashboardProps {
  firestoreLogs: string;
  isAdmin: boolean;
}

export default function AdminDashboard({
  firestoreLogs,
  isAdmin,
}: AdminDashboardProps) {
    const { payments, updatePayment } = usePaymentContext();

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
        <PaymentStatusTable payments={payments} onPaymentUpdate={updatePayment} />
      </TabsContent>

      
      <TabsContent value="qr">
        {isAdmin ? (
          <QrCodeManager />
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
