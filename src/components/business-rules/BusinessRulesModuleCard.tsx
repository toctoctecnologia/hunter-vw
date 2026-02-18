import { useMemo } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BusinessRulesRuleRow from './BusinessRulesRuleRow';
import { categoryLabels } from './helpers';
import type { BusinessEntity } from '@/types/businessRules';
import type { EditableRule } from '@/hooks/useBusinessRulesViewModel';

interface BusinessRulesModuleCardProps {
  module: { moduleId: string; title: string; description: string; tags: string[]; updatedAt: string };
  rules: EditableRule[];
  entities: BusinessEntity[];
  onUpdateRule: (ruleId: string, updater: (rule: EditableRule) => EditableRule) => void;
  onAddRule: (category: EditableRule['category']) => void;
  onRemoveRule: (ruleId: string) => void;
}

export function BusinessRulesModuleCard({ module, rules, entities, onUpdateRule, onAddRule, onRemoveRule }: BusinessRulesModuleCardProps) {
  const rulesByCategory = useMemo(() => {
    const grouped: Record<string, EditableRule[]> = {};
    rules.forEach(rule => {
      if (!grouped[rule.category]) grouped[rule.category] = [];
      grouped[rule.category].push(rule);
    });
    return grouped;
  }, [rules]);

  const categoriesOrder: EditableRule['category'][] = ['parametros', 'perfis', 'equipes', 'formularios', 'tabelas-auxiliares'];

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {module.title}
              <Badge variant="outline" className="text-xs font-normal">{rules.length} regras</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{module.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {module.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Atualizado em {new Date(module.updatedAt).toLocaleDateString('pt-BR')}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="multiple" className="space-y-3">
          {categoriesOrder.map(category => {
            const categoryRules = rulesByCategory[category] || [];
            return (
              <AccordionItem key={category} value={`${module.moduleId}-${category}`} className="border border-border rounded-lg px-3">
                <AccordionTrigger className="py-3 text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                    {categoryLabels[category]}
                    <Badge variant="outline" className="text-xs font-normal">{categoryRules.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-end mb-3">
                    <Button variant="outline" size="sm" onClick={() => onAddRule(category)} className="gap-2">
                      <Plus className="h-4 w-4" /> Nova regra
                    </Button>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/3">Título</TableHead>
                          <TableHead className="w-1/6">Status</TableHead>
                          <TableHead className="hidden md:table-cell">Valor</TableHead>
                          <TableHead className="hidden md:table-cell">Tags</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryRules.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                              Nenhuma regra cadastrada nesta seção.
                            </TableCell>
                          </TableRow>
                        ) : (
                          categoryRules.map(rule => (
                            <BusinessRulesRuleRow
                              key={rule.ruleId}
                              rule={rule}
                              entities={entities}
                              onChange={updater => onUpdateRule(rule.ruleId, updater)}
                              onRemove={() => onRemoveRule(rule.ruleId)}
                            />
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default BusinessRulesModuleCard;
