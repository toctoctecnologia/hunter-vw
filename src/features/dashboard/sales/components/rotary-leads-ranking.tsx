import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getRanking } from '@/features/dashboard/sales/api/ranking';

import { RotaryRankingAssumed } from '@/features/dashboard/sales/components/rotary-ranking-assumed';
import { RotaryRankingLost } from '@/features/dashboard/sales/components/rotary-ranking-lost';
import { Filters } from '@/features/dashboard/sales/components/manage-tab/filters';

export function RotaryLeadsRanking() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  const { data, isLoading } = useQuery({
    queryKey: ['roullete-ranking', selectedMonth, selectedYear],
    queryFn: () => getRanking(Number(selectedMonth), Number(selectedYear)),
  });

  return (
    <div className="space-y-4">
      <Filters
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RotaryRankingAssumed brokers={data?.topCatchers ?? []} isLoading={isLoading} />
        <RotaryRankingLost brokers={data?.bottomCatchers ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
}
