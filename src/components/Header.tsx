'use client';
import Link from 'next/link';
import { Ticket } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-white/10 sticky top-0 bg-background/50 backdrop-blur-sm z-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Ticket className="h-7 w-7 text-accent" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            FestPay
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 md:gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Student
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
