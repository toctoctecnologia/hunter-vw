'use client';
import type { SaleDetail } from '../types';

interface SaleHeaderProps {
  sale: SaleDetail;
}

export default function SaleHeader({ sale }: SaleHeaderProps) {
  const { property, soldPrice, soldAt } = sale;
  return (
    <div className="flex gap-4 items-start">
      {property.image && (
        <img
          src={property.image}
          alt={property.title}
          className="w-32 h-24 object-cover rounded-lg"
        />
      )}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{property.title}</h2>
        <p className="text-sm text-muted-foreground">
          {property.code} • {property.city}
        </p>
        <p className="text-sm text-muted-foreground">
          Vendido em {new Date(soldAt).toLocaleDateString('pt-BR')}
        </p>
        <p className="text-lg font-bold">
          {soldPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </p>
      </div>
    </div>
  );
}
