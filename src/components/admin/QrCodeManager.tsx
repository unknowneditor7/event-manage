'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

export default function QrCodeManager({ qrCode, onQrCodeChange }: { qrCode: ImagePlaceholder, onQrCodeChange: (newQrCode: ImagePlaceholder) => void }) {
  const [newQrCodeUrl, setNewQrCodeUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (newQrCodeUrl.trim() && new URL(newQrCodeUrl)) {
        onQrCodeChange({ ...qrCode, imageUrl: newQrCodeUrl });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onQrCodeChange({ ...qrCode, imageUrl: result });
        toast({
          title: 'QR Code Updated',
          description: 'The new QR code is now displayed.',
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
              src={qrCode.imageUrl}
              alt="Current QR Code"
              width={250}
              height={250}
              className="rounded-md"
              key={qrCode.imageUrl}
              unoptimized
            />
          </div>
        </div>
        <div className="space-y-6">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
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
            <Button type="submit">Update from URL</Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <div>
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <Button onClick={handleUploadClick} variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload from computer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
