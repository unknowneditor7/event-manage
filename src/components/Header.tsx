'use client';
import Link from 'next/link';
import { Ticket, LogOut, LogIn, UserCircle } from 'lucide-react';
import { useAuthContext } from '@/lib/auth';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const { isAdmin, logout, loading } = useAuthContext();
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <header className="py-4 px-4 md:px-8 border-b border-white/10 sticky top-0 bg-background/50 backdrop-blur-sm z-20">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Ticket className="h-7 w-7 text-accent" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            vishwa
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
          <div className="w-px h-6 bg-border" />
          {loading ? (
            <div className="w-8 h-8 bg-muted-foreground/50 rounded-full animate-pulse" />
          ) : isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={handleSignIn}>
              <LogIn className="mr-2" /> Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
