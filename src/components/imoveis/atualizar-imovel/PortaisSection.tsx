import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink } from 'lucide-react';

export function PortaisSection() {
  const portaisData = [
    {
      portal: 'OLX Brasil (ZAP, Viva Real e OLX)',
      tipo: 'Simples',
      situacao: 'Ativo',
      primeiroEnvio: '24/11/2023 23:28',
      ultimoEnvio: '14/08/2025 01:08',
      situacaoProxima: 'Enviar para portais'
    },
    {
      portal: 'Imóvel Web',
      tipo: 'Simples',
      situacao: 'Ativo',
      primeiroEnvio: '24/11/2023 18:40',
      ultimoEnvio: '14/08/2025 18:43',
      situacaoProxima: 'Enviar para portais'
    },
    {
      portal: 'Chaves na mão',
      tipo: 'Simples',
      situacao: 'Ativo',
      primeiroEnvio: '24/11/2023 20:21',
      ultimoEnvio: '14/08/2025 20:40',
      situacaoProxima: 'Enviar para portais'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-6">
        <Globe className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Site | Portais de anúncio</h3>
      </div>

      {/* Configuration Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Publicação na internet
            </label>
            <p className="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
              Liberada
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Tipo destaque site
            </label>
            <p className="text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
              Simples
            </p>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Exibir imóvel no meu site
            </label>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-green-500 rounded bg-green-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
              <span className="text-sm text-green-600 font-medium">Ativo</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Url pública
          </label>
          <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-gray-200">
            <input 
              type="text" 
              readOnly 
              value="https://meusite.com.br/imovel/1771"
              className="flex-1 text-sm text-gray-600 bg-transparent border-none outline-none"
            />
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Portals Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Portal</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Tipo</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Situação</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Primeiro envio</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Último envio</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-900">Situação próxima</th>
            </tr>
          </thead>
          <tbody>
            {portaisData.map((portal, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-900 font-medium max-w-[150px]">
                  {portal.portal}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {portal.tipo}
                </td>
                <td className="p-3">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {portal.situacao}
                  </Badge>
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {portal.primeiroEnvio}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {portal.ultimoEnvio}
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {portal.situacaoProxima}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Read-only Notice */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl">
        <p className="text-sm text-blue-800">
          ℹ️ Esta seção é somente leitura. As configurações dos portais são gerenciadas automaticamente pelo sistema.
        </p>
      </div>
    </div>
  );
}