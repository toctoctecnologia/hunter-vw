import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangeKey } from '@/data/leads/leadTypes';
import { safeGetItem, safeSetItem } from '@/utils/storage';

interface DateRangeSelectProps {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
}

export default function DateRangeSelect({ value, onChange }: DateRangeSelectProps) {
  const RANGE_KEY = 'leads.dashboard.range';

  useEffect(() => {
    const stored = safeGetItem(RANGE_KEY) as DateRangeKey | null;
    if (stored) {
      onChange(stored);
    }
  }, [onChange]);

  useEffect(() => {
    safeSetItem(RANGE_KEY, value);
  }, [value]);

  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRangeKey)}>
      <SelectTrigger className="w-32" aria-label="Selecionar período">
        <SelectValue />
      </SelectTrigger>
      <SelectContent aria-label="Opções de período">
        <SelectItem value="7d">7 dias</SelectItem>
        <SelectItem value="30d">30 dias</SelectItem>
        <SelectItem value="90d">90 dias</SelectItem>
        <SelectItem value="365d">365 dias</SelectItem>
        <SelectItem value="all">Todos</SelectItem>
      </SelectContent>
    </Select>
  );
}

