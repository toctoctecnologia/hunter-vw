import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { Lead } from '@/types/lead';
import InlineEditable from '../components/InlineEditable';
import leadDetailMock from '../mocks/leadDetail.mock';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

interface OverviewTabProps {
  initialLead?: Lead;
}

export function OverviewTab({ initialLead }: OverviewTabProps) {
  const [lead, setLead] = useState<Lead>(USE_MOCKS ? leadDetailMock : (initialLead as Lead));

  const mutation = useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      await fetch(`/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },
  });

  const handleSave = (field: keyof Lead) => async (value: string) => {
    const previous = lead[field];
    setLead(prev => ({ ...prev, [field]: value }));
    try {
      await mutation.mutateAsync({ [field]: value });
    } catch {
      setLead(prev => ({ ...prev, [field]: previous }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Nome</label>
          <InlineEditable value={lead.name} onSave={handleSave('name')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
          <InlineEditable value={lead.email || ''} onSave={handleSave('email')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Telefone</label>
          <InlineEditable value={lead.phone} onSave={handleSave('phone')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Status</label>
          <InlineEditable value={lead.status || ''} onSave={handleSave('status')} />
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
