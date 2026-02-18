import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReactNode, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type LeadTabValue = 'visao-geral' | 'atividades' | 'tarefas' | 'deals' | 'pos-venda';

interface LeadTabsProps {
  active: LeadTabValue;
  onChange: (value: LeadTabValue) => void;
  visaoGeral: ReactNode;
  atividades: ReactNode;
  tarefas: ReactNode;
  deals?: ReactNode;
  posVenda?: ReactNode;
}

export function LeadTabs({ active, onChange, visaoGeral, atividades, tarefas, deals, posVenda }: LeadTabsProps) {
  const columns = useMemo(() => {
    let count = 3;
    if (deals) count += 1;
    if (posVenda) count += 1;
    return count;
  }, [deals, posVenda]);

  const listClass = useMemo(() => {
    const base = 'grid bg-transparent h-auto p-0';
    const mapping: Record<number, string> = {
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
    };
    return cn(base, mapping[columns] ?? 'grid-cols-3');
  }, [columns]);

  return (
    <Tabs value={active} onValueChange={val => onChange(val as LeadTabValue)} className="flex-1 flex flex-col">
      <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900">
        <div className="border-b border-gray-200">
          <TabsList className={listClass}>
            <TabsTrigger
              value="visao-geral"
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-white data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:shadow-none rounded-full mx-1"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="atividades"
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-white data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:shadow-none rounded-full mx-1"
            >
              Atividades
            </TabsTrigger>
            <TabsTrigger
              value="tarefas"
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-white data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:shadow-none rounded-full mx-1"
            >
              Tarefas
            </TabsTrigger>
            {deals && (
              <TabsTrigger
                value="deals"
                className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-white data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:shadow-none rounded-full mx-1"
              >
                Negócios
              </TabsTrigger>
            )}
            {posVenda && (
              <TabsTrigger
                value="pos-venda"
                className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-white data-[state=active]:bg-[hsl(var(--accent))] data-[state=active]:shadow-none rounded-full mx-1"
              >
                Pós-venda
              </TabsTrigger>
            )}
          </TabsList>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {active === 'visao-geral' && visaoGeral}
            {active === 'atividades' && atividades}
            {active === 'tarefas' && tarefas}
            {active === 'deals' && deals}
            {active === 'pos-venda' && posVenda}
          </motion.div>
        </AnimatePresence>
      </div>
    </Tabs>
  );
}
