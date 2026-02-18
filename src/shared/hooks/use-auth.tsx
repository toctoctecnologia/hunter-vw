
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { UserInformation } from '@/shared/types';

import { api } from '@/shared/lib/api';

import { LoadingFull } from '@/shared/components/loading-full';

interface AuthContextProps {
  user: UserInformation | null;
  refreshUserInformation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserInformation | null>(null);

  async function handleGetUserInformation() {
    try {
      const response = await api.get<UserInformation>('account/user/information');
      setUser(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching user information:', error.message);
      } else {
        console.error('Unknown error fetching user information');
      }
    }
  }

  async function handleRefreshUserInformation() {
    try {
      const response = await api.get<UserInformation>('account/user/information');
      setUser(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error refreshing user information:', error.message);
      } else {
        console.error('Unknown error refreshing user information');
      }
    }
  }

  useEffect(() => {
    if (!user) {
      handleGetUserInformation();
    }
  }, [user]);

  if (!user) {
    return <LoadingFull title="Carregando..." />;
  }

  return (
    <AuthContext.Provider value={{ user, refreshUserInformation: handleRefreshUserInformation }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
