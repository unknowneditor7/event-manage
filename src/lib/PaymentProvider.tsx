'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Payment, PaymentSettings } from './definitions';
import { payments as initialPayments } from './data';

interface PaymentContextType {
  payments: Payment[];
  updatePayment: (paymentId: string, status: 'completed' | 'pending') => void;
  paymentSettings: PaymentSettings;
  setPaymentSettings: (settings: PaymentSettings) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const DEFAULT_AMOUNT = 240;
const LOCAL_STORAGE_KEY = 'paymentSettings';

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments.map(p => ({...p, amount: DEFAULT_AMOUNT})));
  const [paymentSettings, setPaymentSettingsState] = useState<PaymentSettings>({ amount: DEFAULT_AMOUNT });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setPaymentSettingsState(parsedSettings);
         setPayments(prev => prev.map(p => ({...p, amount: parsedSettings.amount })));
      }
    } catch (error) {
      console.error('Could not access local storage for payment settings', error);
    }
    setIsInitialized(true);
  }, []);

  const setPaymentSettings = (settings: PaymentSettings) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
      setPaymentSettingsState(settings);
      setPayments(prevPayments =>
        prevPayments.map(p => ({ ...p, amount: settings.amount }))
      );
    } catch (error) {
      console.error('Could not save payment settings to local storage', error);
    }
  };

  const updatePayment = (paymentId: string, status: 'completed' | 'pending') => {
    setPayments(prevPayments =>
      prevPayments.map(p =>
        p.id === paymentId ? { ...p, status } : p
      )
    );
  };
  
  if (!isInitialized) {
    return null;
  }

  return (
    <PaymentContext.Provider value={{ payments, updatePayment, paymentSettings, setPaymentSettings }}>
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
