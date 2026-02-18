import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

const STORAGE_KEY = 'language';

export function useIdioma() {
  const [language, setLanguage] = useState('pt-BR');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setLanguage(stored);
  }, []);

  const mutation = useMutation({
    mutationFn: async (lang: string) => {
      const res = await fetch('/api/profile/language', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: lang }),
      });
      if (!res.ok) throw new Error('Failed to update language');
      return lang;
    },
    onSuccess: lang => {
      setLanguage(lang);
      localStorage.setItem(STORAGE_KEY, lang);
    },
  });

  return {
    language,
    setLanguage: (lang: string) => mutation.mutateAsync(lang),
    updating: mutation.isPending,
  } as const;
}

export type UseIdiomaReturn = ReturnType<typeof useIdioma>;
