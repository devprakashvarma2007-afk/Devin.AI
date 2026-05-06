import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuth, signIn } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuth((u) => {
      setUser(u);
      setLoading(false);
    });

    signIn().catch(() => setLoading(false));

    return unsubscribe;
  }, []);

  return { user, loading };
}
