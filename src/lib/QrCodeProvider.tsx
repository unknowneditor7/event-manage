'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

interface QrCodeContextType {
  qrCode: ImagePlaceholder;
  setQrCode: (qrCode: ImagePlaceholder) => void;
  deleteQrCode: () => void;
}

const QrCodeContext = createContext<QrCodeContextType | undefined>(undefined);

const defaultQrCode = PlaceHolderImages.find((img) => img.id === 'qr-code-1');
if (!defaultQrCode) {
  throw new Error("Default QR code placeholder not found");
}

export function QrCodeProvider({ children }: { children: ReactNode }) {
  const [qrCode, setQrCodeState] = useState<ImagePlaceholder>(defaultQrCode);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedQrCode = localStorage.getItem('customQrCode');
      if (storedQrCode) {
        setQrCodeState(JSON.parse(storedQrCode));
      }
    } catch (error) {
      console.error('Could not access local storage or parse QR code', error);
    }
    setIsInitialized(true);
  }, []);

  const setQrCode = (newQrCode: ImagePlaceholder) => {
    try {
      localStorage.setItem('customQrCode', JSON.stringify(newQrCode));
      setQrCodeState(newQrCode);
    } catch (error) {
      console.error('Could not save QR code to local storage', error);
    }
  };

  const deleteQrCode = () => {
    try {
      localStorage.removeItem('customQrCode');
      setQrCodeState(defaultQrCode);
    } catch (error) {
        console.error('Could not remove QR code from local storage', error);
    }
  };

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <QrCodeContext.Provider value={{ qrCode, setQrCode, deleteQrCode }}>
      {children}
    </QrCodeContext.Provider>
  );
}

export function useQrCodeContext() {
  const context = useContext(QrCodeContext);
  if (context === undefined) {
    throw new Error('useQrCodeContext must be used within a QrCodeProvider');
  }
  return context;
}
