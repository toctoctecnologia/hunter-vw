'use client';
import { KpiDetalhado } from '../types';

interface UserProfileListsProps {
  data: KpiDetalhado | null;
  loading?: boolean;
  error?: string | null;
}

export default function UserProfileLists({ data, loading, error }: UserProfileListsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
            <div className="mb-4">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded mt-1" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-16 bg-muted/30 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Indicações Recebidas */}
      <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Indicações Recebidas</h3>
          <p className="text-sm text-muted-foreground">Novos clientes indicados</p>
        </div>
        <div className="space-y-3">
          {data?.ultimasIndicacoes?.slice(0, 3).map((indicacao, index) => (
            <div key={index} className="p-3 rounded-lg bg-background/30 border border-border/20 hover:bg-background/50 transition-colors">
              <div className="font-medium text-sm text-foreground">{indicacao.nome}</div>
              <div className="text-xs text-muted-foreground">{indicacao.origem}</div>
              <div className="text-xs text-muted-foreground">{new Date(indicacao.data).toLocaleDateString('pt-BR')}</div>
            </div>
          )) || (
            [
              { nome: 'Carlos Lima', origem: 'Helena Almeida', data: '2025-07-28' },
              { nome: 'Marina Santos', origem: 'Cliente Anterior', data: '2025-07-24' },
              { nome: 'Roberto Silva', origem: 'Parceiro Imobiliário', data: '2025-07-19' }
            ].map((indicacao, index) => (
              <div key={index} className="p-3 rounded-lg bg-background/30 border border-border/20 hover:bg-background/50 transition-colors">
                <div className="font-medium text-sm text-foreground">{indicacao.nome}</div>
                <div className="text-xs text-muted-foreground">{indicacao.origem}</div>
                <div className="text-xs text-muted-foreground">{new Date(indicacao.data).toLocaleDateString('pt-BR')}</div>
              </div>
            ))
          )}
        </div>
        <button className="mt-4 text-sm text-primary hover:underline font-medium">Ver todos</button>
      </div>

      {/* Feedbacks Recentes */}
      <div className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Feedbacks Recentes</h3>
          <p className="text-sm text-muted-foreground">Avaliações de clientes</p>
        </div>
        <div className="space-y-3">
          {[
            { cliente: 'Helena Almeida', imovel: 'Falcon Tower', data: '22/07/2025', estrelas: 4, comentario: 'Atendimento ágil e claro.' },
            { cliente: 'João Silva', imovel: 'Torre Premium', data: '17/07/2025', estrelas: 5, comentario: 'Excelente profissional.' }
          ].map((feedback, index) => (
            <div key={index} className="p-3 rounded-lg bg-background/30 border border-border/20 hover:bg-background/50 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="font-medium text-sm text-foreground">{feedback.cliente}</div>
                <div className="flex">
                  {Array.from({ length: feedback.estrelas }).map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xs">⭐</span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{feedback.imovel} • {feedback.data}</div>
              <div className="text-xs text-muted-foreground italic mt-1">"{feedback.comentario}"</div>
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm text-primary hover:underline font-medium">Ver todos</button>
      </div>
    </div>
  );
}