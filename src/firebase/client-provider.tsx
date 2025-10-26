'use client';

import { initializeFirebase } from '@/firebase/index';
import { FirebaseProvider } from '@/firebase/provider';
import {
  FirebaseApp,
} from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';


let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

if (typeof window !== 'undefined') {
  const services = initializeFirebase();
  app = services.app;
  auth = services.auth;
  firestore = services.firestore;
}

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
