'use client';

import { PropertyCard } from '@/components/imoveis';
import { PropertySaleSummary } from '../types';

interface UserLastSalesProps {
  sales: PropertySaleSummary[];
}

export default function UserLastSales({ sales }: UserLastSalesProps) {
  if (!sales || sales.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sales.map(sale => (
        <PropertyCard
          key={sale.id}
          id={sale.id}
          code={sale.code}
          type={sale.type}
          title={sale.title}
          city={sale.city}
          price={sale.salePrice}
          area={sale.area}
          beds={sale.beds}
          baths={sale.baths}
          parking={sale.parking}
          statusBadge={sale.status}
          lastContact={new Date(sale.saleDate).toLocaleDateString('pt-BR')}
          lastContactLabel="Data da venda:"
          coverUrl={sale.image}
          compact
          actions={
            <a
              href={`/vendas/${sale.saleId}`}
              className="flex-1 bg-[hsl(var(--accent))] text-white py-3 rounded-xl font-medium active:scale-95 transition-transform text-center"
            >
              Ver Detalhes da Venda
            </a>
          }
        />
      ))}
    </div>
  );
}
