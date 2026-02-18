'use client';

import { useMemo } from 'react';
import { Star } from 'lucide-react';
import { KpiDetalhado } from '../types';
interface UserKPIsProps {
  data: KpiDetalhado | null;
  loading?: boolean;
  error?: string | null;
}
export default function UserKPIs({
  data,
  loading,
  error
}: UserKPIsProps) {
  if (loading) return <div className="p-4">Carregando...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data) return null;
  const conv = useMemo(() => data.resumo.leadsRecebidos ? data.resumo.vendas / data.resumo.leadsRecebidos : 0, [data]);
  const vacancy = useMemo(() => {
    const period = data.vacancia.length;
    const vacant = data.vacancia.filter(v => !v.vendeu).length;
    return period ? vacant / period : 0;
  }, [data]);
  return <div className="space-y-8 animate-fade-in">
      {/* KPIs Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[{
        k: 'Captações',
        v: data.resumo.captacoes
      }, {
        k: 'Imóveis vendidos',
        v: data.resumo.vendasQtd
      }, {
        k: 'Taxa de vacância',
        v: `${(vacancy * 100).toFixed(0)}%`
      }, {
        k: 'Valor vendido',
        v: `R$ ${data.resumo.vendasValorTotal.toLocaleString('pt-BR')}`
      }, {
        k: 'Taxa de conversão',
        v: `${(conv * 100).toFixed(1)}%`
      }, {
        k: 'Ticket médio',
        v: `R$ ${data.resumo.ticketMedio.toLocaleString('pt-BR')}`
      }, {
        k: 'Tempo de fechamento',
        v: `${data.resumo.tempoMedioFechamentoDias} dias`
      }, {
        k: 'Taxa de follow-up',
        v: `${(data.resumo.taxaFollowUp * 100).toFixed(0)}%`
      }, {
        k: 'Agenda cumprida',
        v: `${(data.resumo.agendaCumprida * 100).toFixed(0)}%`
      }, {
        k: 'Tempo médio de resposta',
        v: `${data.resumo.tempoMedioRespostaMin} min`
      }, {
        k: 'Uso de ferramentas',
        v: `${(data.resumo.usoFerramentasScore * 100).toFixed(0)}%`
      }, {
        k: 'NPS',
        v: `${data.resumo.nps}`
      }, {
        k: 'Indicações recebidas',
        v: data.resumo.indicacoes
      }, {
        k: 'Retenção de clientes',
        v: data.resumo.retencoes
      }].map((card, i) => <div key={i} className="group relative overflow-hidden rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-border hover:bg-background">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="text-sm font-medium text-muted-foreground mb-2">{card.k}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{card.v}</div>
            </div>
          </div>)}
      </section>
      {/* Últimas Vendas */}
      <section className="rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="mb-6 text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Últimas Vendas</h3>
        <ul className="space-y-4">
          {data.ultimasVendas.map(venda => <li key={venda.saleId} className="group flex items-center justify-between p-4 rounded-lg border border-border/20 hover:border-border/60 bg-background/30 hover:bg-background/80 transition-all duration-200">
              <div className="space-y-1">
                <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{venda.propertyId}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(venda.soldAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div className="font-bold text-lg text-primary">
                R$ {venda.soldPrice.toLocaleString('pt-BR')}
              </div>
            </li>)}
        </ul>
        <button className="mt-6 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all duration-200">
          Ver todos
        </button>
      </section>

      {/* Indicações Recebidas */}
      

      {/* Feedbacks Recentes */}
      
    </div>;
}