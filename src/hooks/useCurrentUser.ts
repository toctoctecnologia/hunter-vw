import { useEffect, useState } from 'react';
import type { AuthUser } from '@/utils/auth';
import { getCurrentUser } from '@/utils/auth';

export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return user;
}

export default useCurrentUser;
