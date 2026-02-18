import { useEffect } from 'react';
import { useLeadsStore } from '@/hooks/vendas';

export function LeadsList() {
  const { leads, loading, error, load } = useLeadsStore();

  useEffect(() => {
    load();
  }, [load]);

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-red-500">
        Erro ao carregar leads: {error}{' '}
        <button
          onClick={load}
          className="ml-2 rounded bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Carregando leads...
      </div>
    );
  }

  if (!leads?.length) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        Nenhum lead encontrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Telefone</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Origem</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads?.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm text-gray-900">{lead.name}</td>
              <td className="px-4 py-4 text-sm text-gray-500">{lead.phone}</td>
              <td className="px-4 py-4 text-sm text-gray-500">{lead.source}</td>
              <td className="px-4 py-4 text-sm text-gray-500">{lead.status}</td>
            </tr>
          )) ?? []}
        </tbody>
      </table>
    </div>
  );
}

export default LeadsList;
