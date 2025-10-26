'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEventNameContext } from '@/lib/EventNameProvider';
import { Loader2 } from 'lucide-react';

export default function EventNameManager() {
  const { eventName, setEventName } = useEventNameContext();
  const [name, setName] = useState(eventName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.trim()) {
      setIsSubmitting(true);
      setEventName(name);
      setTimeout(() => {
        toast({
          title: 'Event Name Updated',
          description: `The event name is now "${name}".`,
        });
        setIsSubmitting(false);
      }, 500);
    } else {
      toast({
        variant: 'destructive',
        title: 'Invalid Name',
        description: 'Event name cannot be empty.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Event Settings</CardTitle>
        <CardDescription>Manage the name of the event.</CardDescription>
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Event Name
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
