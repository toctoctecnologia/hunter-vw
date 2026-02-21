
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { UserInformation } from '@/shared/types';

import { api } from '@/shared/lib/api';

import { LoadingFull } from '@/shared/components/loading-full';

type PermissionItem = { code: string; name: string; description: string };

interface SafeUserInformation extends UserInformation {
  /** Pre-extracted permissions for safe access without optional chaining */
  _permissions: PermissionItem[];
}

interface AuthContextProps {
  user: SafeUserInformation | null;
  refreshUserInformation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

function isValidUserInformation(data: unknown): data is UserInformation {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (!obj.userInfo || typeof obj.userInfo !== 'object') return false;
  const info = obj.userInfo as Record<string, unknown>;
  return !!info.profile && typeof info.profile === 'object';
}

function toSafeUser(data: UserInformation): SafeUserInformation {
  return {
    ...data,
    _permissions: data.userInfo?.profile?.permissions ?? [],
  };
}

function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SafeUserInformation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  async function handleGetUserInformation() {
    try {
      const response = await api.get<UserInformation>('account/user/information');
      if (isValidUserInformation(response.data)) {
        setUser(toSafeUser(response.data));
        setLoadError(false);
      } else {
        console.error('[AuthProvider] API returned invalid user data shape:', typeof response.data);
        setUser(null);
        setLoadError(true);
      }
    } catch (error: unknown) {
      console.error('[AuthProvider] Error fetching user information:', error);
      setUser(null);
      setLoadError(true);
    }
  }

  async function handleRefreshUserInformation() {
    try {
      const response = await api.get<UserInformation>('account/user/information');
      if (isValidUserInformation(response.data)) {
        setUser(toSafeUser(response.data));
      } else {
        console.error('[AuthProvider] Refresh returned invalid user data shape');
      }
    } catch (error: unknown) {
      console.error('[AuthProvider] Error refreshing user information:', error);
    }
  }

  useEffect(() => {
    handleGetUserInformation().finally(() => setIsLoading(false));
  }, []);

  const contextValue = useMemo(
    () => ({ user, refreshUserInformation: handleRefreshUserInformation }),
    [user],
  );

  if (isLoading) {
    return <LoadingFull title="Carregando..." />;
  }

  if (loadError && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">Erro ao carregar dados</h1>
          <p className="text-muted-foreground">
            Não foi possível carregar suas informações. Verifique sua conexão e tente novamente.
          </p>
          <p className="text-xs text-muted-foreground">
            Se o problema persistir, verifique se a variável <code>VITE_API_URL</code> está configurada.
          </p>
          <button
            onClick={() => {
              setLoadError(false);
              setIsLoading(true);
              handleGetUserInformation().finally(() => setIsLoading(false));
            }}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
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
