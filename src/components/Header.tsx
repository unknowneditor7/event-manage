'use client';
import Link from 'next/link';
import { LogOut, LogIn } from 'lucide-react';
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

const VsLogo = () => (
  <div className="relative h-7 w-7">
    <svg
      viewBox="0 0 24 24"
      fill="white"
      className="h-full w-full"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="font-headline text-xs font-bold text-primary">VS</span>
    </div>
  </div>
);


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
          <VsLogo />
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
