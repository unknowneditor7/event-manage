'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Payment, PaymentSettings } from './definitions';
import { payments as initialPaymentsData } from './data';

interface PaymentContextType {
  payments: Payment[];
  updatePayment: (paymentId: string, status: 'completed' | 'pending') => void;
  paymentSettings: PaymentSettings;
  setPaymentSettings: (settings: PaymentSettings) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const DEFAULT_AMOUNT = 240;
const PAYMENT_SETTINGS_KEY = 'paymentSettings';
const PAYMENTS_DATA_KEY = 'paymentsData';

const initialSettings = { amount: DEFAULT_AMOUNT };

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [paymentSettings, setPaymentSettingsState] = useState<PaymentSettings>(initialSettings);
  
  // Initialize state from a function to read from localStorage only once.
  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const storedPayments = typeof window !== 'undefined' ? localStorage.getItem(PAYMENTS_DATA_KEY) : null;
      if (storedPayments) {
        return JSON.parse(storedPayments);
      }
    } catch (error) {
      console.error('Could not access local storage for payments data', error);
    }
    // Fallback to initial data if nothing in storage
    return initialPaymentsData.map(p => ({...p, amount: initialSettings.amount}));
  });

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(PAYMENT_SETTINGS_KEY);
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        setPaymentSettingsState(settings);
      }
    } catch (error) {
      console.error('Could not access local storage for payment settings', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(PAYMENT_SETTINGS_KEY, JSON.stringify(paymentSettings));
       setPayments(prevPayments =>
        prevPayments.map(p => ({ ...p, amount: paymentSettings.amount }))
      );
    } catch (error) {
      console.error('Could not save payment settings to local storage', error);
    }
  }, [paymentSettings]);
  
  useEffect(() => {
    try {
        localStorage.setItem(PAYMENTS_DATA_KEY, JSON.stringify(payments));
    } catch (error) {
        console.error('Could not save payments data to local storage', error);
    }
  }, [payments]);

  const setPaymentSettings = (settings: PaymentSettings) => {
    setPaymentSettingsState(settings);
  };

  const updatePayment = (paymentId: string, status: 'completed' | 'pending') => {
    setPayments(prevPayments =>
      prevPayments.map(p =>
        p.id === paymentId ? { ...p, status, timestamp: new Date().toISOString() } : p
      )
    );
  };

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
