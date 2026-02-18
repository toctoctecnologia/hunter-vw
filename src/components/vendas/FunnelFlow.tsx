import React from 'react';
import { funnelGradientFor } from './funil/funnelColors';

const CLOSED_DEAL_GRADIENT = "linear-gradient(180deg, #16A34A 0%, #166534 100%)";

interface FunnelStage {
  slug: string;
  count: number;
  label: string;
  description?: string;
}

interface FunnelFlowProps {
  stages: FunnelStage[];
  onStageClick?: (stageSlug: string) => void;
}

export const FunnelFlow: React.FC<FunnelFlowProps> = ({ stages, onStageClick }) => {

  const getFunnelWidth = (index: number, total: number) => {
    // Criar formato de ampulheta mais pronunciado
    const normalizedPosition = index / (total - 1); // 0 to 1
    
    // Função para criar formato de ampulheta mais acentuado
    let widthFactor;
    if (normalizedPosition <= 0.5) {
      // Primeira metade - diminui mais drasticamente
      const t = normalizedPosition * 2; // 0 to 1
      widthFactor = 1 - (t * t * 0.7); // 100% -> 30% (curva quadrática)
    } else {
      // Segunda metade - aumenta novamente
      const t = (normalizedPosition - 0.5) * 2; // 0 to 1
      widthFactor = 0.3 + (t * t * 0.7); // 30% -> 100% (curva quadrática)
    }
    
    const minWidth = 160;
    const maxWidth = 480;
    return minWidth + (maxWidth - minWidth) * widthFactor;
  };

  return (
    <div className="flex flex-col items-center py-8 bg-orange-50 min-h-[600px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Funil de Vendas</h2>
      
      <div className="relative flex flex-col items-center space-y-2">
        {stages.map((stage, idx) => {
          const width = getFunnelWidth(idx, stages.length);
          const totalLeads = stages.reduce((sum, s) => sum + s.count, 0);
          const percentage = totalLeads > 0 ? Math.round((stage.count / totalLeads) * 100) : 0;
          
          return (
            <div
              key={stage.slug}
              className="relative group cursor-pointer transition-all duration-300 hover:scale-105"
              style={{ width: `${width}px` }}
              onClick={() => onStageClick?.(stage.slug)}
            >
              {/* Estágio do funil */}
              <div
                className="
                  text-white font-semibold text-sm
                  flex items-center justify-between
                  px-6 py-5 rounded-xl shadow-xl
                  transition-all duration-300
                  hover:shadow-2xl hover:scale-105
                  border border-orange-200/30
                "
                style={{
                  background: stage.slug === "negócio_fechado"
                    ? CLOSED_DEAL_GRADIENT
                    : funnelGradientFor(idx),
                }}
              >
                <span className="flex-1 text-center">{stage.label}</span>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold">{stage.count}</span>
                  <span className="text-xs opacity-90">{percentage}%</span>
                </div>
              </div>
              
              {/* Conector para o próximo estágio */}
              {idx < stages.length - 1 && (
                <div className="flex justify-center">
                  <div 
                    className="w-0 h-0 mt-2 drop-shadow-md"
                    style={{
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderTop: '16px solid #fb923c',
                    }}
                  />
                </div>
              )}
              
              {/* Tooltip com informações adicionais */}
              <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                  <div className="text-sm font-medium">{stage.label}</div>
                  <div className="text-xs text-gray-300">
                    {stage.count} leads ({percentage}% do total)
                  </div>
                  {stage.description && (
                    <div className="text-xs text-gray-400 mt-1 max-w-xs">
                      {stage.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Estatísticas do funil */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">
            {stages.reduce((sum, s) => sum + s.count, 0)}
          </div>
          <div className="text-sm text-gray-600">Total de Leads</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {stages.find(s => s.label.toLowerCase().includes('fechado'))?.count || 0}
          </div>
          <div className="text-sm text-gray-600">Negócios Fechados</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            {stages.length > 0 && stages.reduce((sum, s) => sum + s.count, 0) > 0
              ? Math.round(((stages.find(s => s.label.toLowerCase().includes('fechado'))?.count || 0) / 
                  stages.reduce((sum, s) => sum + s.count, 0)) * 100)
              : 0}%
          </div>
          <div className="text-sm text-gray-600">Taxa de Conversão</div>
        </div>
      </div>
    </div>
  );
};