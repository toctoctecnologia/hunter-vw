import { useState } from 'react';
import type { Lead } from '@/types/lead';
import { useLeadStages } from '@/hooks/pipeline/useLeadStages';

interface PostSaleTabProps {
  lead: Lead;
}

export function PostSaleTab({ lead }: PostSaleTabProps) {
  const { updateStage } = useLeadStages();
  const [commission, setCommission] = useState('');
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    setPaid(true);
    if (lead.stage !== 'receita_gerada') {
      const ok = await updateStage(lead.id, lead.stage, 'receita_gerada');
      if (ok) {
        await fetch(`/api/leads/${lead.id}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'commission_recorded',
          }),
        });
      }
    } else {
      await fetch(`/api/leads/${lead.id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'commission_recorded',
        }),
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Resumo do Negócio</h4>
        <p className="text-sm text-gray-600">Valor: {lead.value || '—'}</p>
        <p className="text-sm text-gray-600">Descrição: {lead.summary || '—'}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Pagamento de Comissão</h4>
        <div className="space-y-3">
          <input
            type="text"
            value={commission}
            onChange={e => setCommission(e.target.value)}
            placeholder="Valor da comissão"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            disabled={paid}
            onClick={handlePayment}
            className="w-full py-2 px-4 bg-orange-600 text-white rounded disabled:opacity-50"
          >
            {paid ? 'Comissão paga' : 'Confirmar pagamento'}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Checklist Pós-venda</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            Documentação finalizada
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            Chaves entregues
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            Follow-up realizado
          </label>
        </div>
      </div>
    </div>
  );
}

export default PostSaleTab;
