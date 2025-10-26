'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

interface QrCodeContextType {
  qrCode: ImagePlaceholder;
  setQrCode: (qrCode: ImagePlaceholder) => void;
}

const QrCodeContext = createContext<QrCodeContextType | undefined>(undefined);

export function QrCodeProvider({ children }: { children: ReactNode }) {
  const initialQrCode = PlaceHolderImages.find((img) => img.id === 'qr-code-1');
  if (!initialQrCode) {
    throw new Error("Initial QR code placeholder not found");
  }

  const [qrCode, setQrCode] = useState<ImagePlaceholder>(initialQrCode);

  return (
    <QrCodeContext.Provider value={{ qrCode, setQrCode }}>
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
