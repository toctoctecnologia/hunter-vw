import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PeriodSelectProps {
  value: number;
  onChange: (days: number) => void;
}

export const PeriodSelect = ({ value, onChange }: PeriodSelectProps) => {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="w-24" aria-label="Selecionar período">
        <SelectValue />
      </SelectTrigger>
      <SelectContent aria-label="Opções de período">
        <SelectItem value="7">7 dias</SelectItem>
        <SelectItem value="15">15 dias</SelectItem>
        <SelectItem value="30">30 dias</SelectItem>
      </SelectContent>
    </Select>
  );
};

