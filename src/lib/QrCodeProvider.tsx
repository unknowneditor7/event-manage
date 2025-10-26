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

const LOCAL_STORAGE_KEY = 'customQrCode';

export function QrCodeProvider({ children }: { children: ReactNode }) {
  const [qrCode, setQrCodeState] = useState<ImagePlaceholder>(defaultQrCode);

  useEffect(() => {
    try {
      const storedQrCode = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedQrCode) {
        setQrCodeState(JSON.parse(storedQrCode));
      }
    } catch (error) {
      console.error('Could not access local storage or parse QR code', error);
    }
  }, []);

  useEffect(() => {
    try {
      if (qrCode.imageUrl === defaultQrCode.imageUrl) {
         localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(qrCode));
      }
    } catch (error) {
      console.error('Could not save QR code to local storage', error);
    }
  }, [qrCode]);


  const setQrCode = (newQrCode: ImagePlaceholder) => {
    setQrCodeState(newQrCode);
  };

  const deleteQrCode = () => {
    setQrCodeState(defaultQrCode);
  };

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
