'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function QrCodeManager({ initialQrCode }: { initialQrCode: ImagePlaceholder }) {
  const [qrCodeUrl, setQrCodeUrl] = useState(initialQrCode.imageUrl);
  const [newQrCodeUrl, setNewQrCodeUrl] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        if (newQrCodeUrl.trim() && new URL(newQrCodeUrl)) {
          setQrCodeUrl(newQrCodeUrl);
          toast({
            title: 'QR Code Updated',
            description: 'The new QR code is now active.',
          });
          setNewQrCodeUrl('');
        } else {
            throw new Error('Invalid URL');
        }
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Invalid URL',
            description: 'Please enter a valid image URL.',
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">QR Code Management</CardTitle>
        <CardDescription>Update the payment QR code for students.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center items-center">
            <div className="p-4 bg-white rounded-lg">
                <Image
                    src={qrCodeUrl}
                    alt="Current QR Code"
                    width={250}
                    height={250}
                    className="rounded-md"
                    key={qrCodeUrl} 
                    unoptimized 
                />
            </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="qr-url">New QR Code Image URL</Label>
            <Input
              id="qr-url"
              type="url"
              placeholder="https://example.com/new-qr.png"
              value={newQrCodeUrl}
              onChange={(e) => setNewQrCodeUrl(e.target.value)}
            />
          </div>
          <Button type="submit">Update QR Code</Button>
        </form>
      </CardContent>
    </Card>
  );
}
