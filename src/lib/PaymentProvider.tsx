'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Payment } from './definitions';
import { payments as initialPayments } from './data';

interface PaymentContextType {
  payments: Payment[];
  updatePayment: (paymentId: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);

  const updatePayment = (paymentId: string) => {
    setPayments(prevPayments =>
      prevPayments.map(p =>
        p.id === paymentId ? { ...p, status: 'completed' } : p
      )
    );
  };

  return (
    <PaymentContext.Provider value={{ payments, updatePayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentContext() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
}
