import { useEffect, useState } from 'react';
import DateRangeSelect from './components/DateRangeSelect';
import SaveDashboardButton from './components/SaveDashboardButton';
import NewAnalysisButton from './components/NewAnalysisButton';
import TopPropertiesWidget from './components/TopPropertiesWidget';
import DonutArchivedByChannel from './charts/DonutArchivedByChannel';
import BarReceivedBySource from './charts/BarReceivedBySource';
import LineReceivedBySeller from './charts/LineReceivedBySeller';

import { DateRangeKey } from '@/data/leads/leadTypes';
import { stats, seedIfEmpty } from '@/data/leads/leadsMockService';

export default function LeadsDashboard() {
  const [range, setRange] = useState<DateRangeKey>('30d');
  const [data, setData] = useState<Record<string, number>>(() => stats(range));

  useEffect(() => {
    seedIfEmpty();
  }, []);

  useEffect(() => {
    setData(stats(range));
  }, [range]);

  const handleLayoutLoad = (layout: { range?: DateRangeKey }) => {
    if (layout?.range) {
      setRange(layout.range);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <DateRangeSelect value={range} onChange={setRange} />
        <div className="flex gap-2">
          <SaveDashboardButton layout={{ range }} onLoad={handleLayoutLoad} />
          <NewAnalysisButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DonutArchivedByChannel data={data} />
        <BarReceivedBySource data={data} />
        <LineReceivedBySeller data={data} />
        <TopPropertiesWidget />
      </div>
    </div>
  );
}

