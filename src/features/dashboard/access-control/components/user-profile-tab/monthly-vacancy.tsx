import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

import { UserDetails } from '@/features/dashboard/access-control/types';

interface MonthlyVacancyProps {
  yearlySales: UserDetails['yearlySales'];
}

export function MonthlyVacancy({ yearlySales }: MonthlyVacancyProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vacância Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Com vendas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Sem vendas</span>
            </div>
          </div>

          {/* Grid de meses */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {yearlySales.map((item) => {
              const hasSales = item.salesCount > 0;
              const isSelected = selectedMonth === item.month;

              return (
                <button
                  key={item.month}
                  onClick={() => setSelectedMonth(isSelected ? null : item.month)}
                  className={`relative flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all hover:scale-105 ${
                    hasSales
                      ? 'border-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-950/20'
                      : 'border-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950/20'
                  } ${isSelected ? 'ring-2 ring-offset-2' : ''}`}
                >
                  <span className="text-sm font-medium">{item.month}</span>
                  {isSelected && (
                    <span className={`mt-2 text-2xl font-bold ${hasSales ? 'text-green-600' : 'text-red-600'}`}>
                      {item.salesCount}
                    </span>
                  )}
                  {isSelected && (
                    <span className="mt-1 text-xs text-muted-foreground">
                      {item.salesCount === 1 ? 'venda' : 'vendas'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
