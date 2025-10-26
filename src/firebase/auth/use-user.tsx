'use client';

import { useEffect, useState } from 'react';
import { onIdTokenChanged, type User, type IdTokenResult } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<IdTokenResult['claims'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onIdTokenChanged(auth, async (newUser) => {
      setLoading(true);
      if (newUser) {
        setUser(newUser);
        const idTokenResult = await newUser.getIdTokenResult();
        setClaims(idTokenResult.claims);
      } else {
        setUser(null);
        setClaims(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, claims, loading };
}
