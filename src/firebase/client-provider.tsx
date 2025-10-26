'use client';

import { initializeFirebase } from '@/firebase/index';
import { FirebaseProvider } from '@/firebase/provider';
import {
  FirebaseApp,
  Auth,
  Firestore,
} from 'firebase/app';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

if (typeof window !== 'undefined') {
  const a = initializeFirebase();
  app = a.app;
  auth = a.auth;
  firestore = a.firestore;
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
