'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TabValue = 'perfil' | 'historico' | 'atualizacoes';

interface Props {
  value: TabValue;
  onValueChange: (v: TabValue) => void;
  role?: string;
}

export default function UserTabs({ value, onValueChange, role }: Props) {
  const canViewHistory = role === 'admin' || role === 'gestor';
  const handleValueChange = (nextValue: string) => {
    onValueChange(nextValue as TabValue);
  };
  return (
    <Tabs value={value} onValueChange={handleValueChange}>
      <TabsList className="h-12 w-fit bg-muted/30 p-1 rounded-xl border border-border/40 shadow-sm">
        <TabsTrigger
          value="perfil"
          className="h-10 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 font-medium"
        >
          Perfil
        </TabsTrigger>
        {canViewHistory && (
          <TabsTrigger
            value="historico"
            className="h-10 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 font-medium"
          >
            Histórico
          </TabsTrigger>
        )}
        <TabsTrigger
          value="atualizacoes"
          className="h-10 px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200 font-medium"
        >
          Atualizações
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
