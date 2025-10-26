'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEventNameContext } from '@/lib/EventNameProvider';
import { usePaymentContext } from '@/lib/PaymentProvider';
import { Loader2 } from 'lucide-react';

export default function EventNameManager() {
  const { eventName, setEventName } = useEventNameContext();
  const { paymentSettings, setPaymentSettings } = usePaymentContext();
  const [name, setName] = useState(eventName);
  const [amount, setAmount] = useState(paymentSettings.amount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim() && amount > 0) {
      setIsSubmitting(true);
      setEventName(name);
      setPaymentSettings({ amount });
      setTimeout(() => {
        toast({
          title: 'Event Settings Updated',
          description: `The event name is now "${name}" and the amount is ₹${amount}.`,
        });
        setIsSubmitting(false);
      }, 500);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Event name cannot be empty and amount must be greater than 0.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Event Settings</CardTitle>
        <CardDescription>Manage the name of the event and the payment amount.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input
              id="event-name"
              type="text"
              placeholder="e.g., Spring Fest 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Payment Amount (₹)</Label>
            <Input
              id="payment-amount"
              type="number"
              placeholder="e.g., 240"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1"
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Event Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
