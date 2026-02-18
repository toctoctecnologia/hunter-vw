import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Lead } from '@/types/lead';

export type { Lead } from '@/types/lead';

export const useLeads = () =>
  useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      const res = await fetch('/api/leads', { cache: 'no-store' });
      if (!res.ok) {
        // In development, return empty array instead of throwing
        if (process.env.NODE_ENV === 'development') {
          console.warn('API endpoint not available, returning empty leads array');
          return [];
        }
        throw new Error('Failed to fetch leads');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });

export const useLead = (id: number) =>
  useQuery<Lead>({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${id}`);
      if (!res.ok) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Lead ${id} not found, returning mock lead`);
          return { 
            id, 
            name: 'Lead Mock', 
            stage: 'pré_atendimento',
            phone: '',
            email: '',
            source: 'mock',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Lead;
        }
        throw new Error('Failed to fetch lead');
      }
      return res.json() as Promise<Lead>;
    },
    enabled: !!id,
  });

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Lead> & { id: number }) => {
      const res = await fetch(`/api/leads/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update lead');
      return res.json() as Promise<Lead>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
};
