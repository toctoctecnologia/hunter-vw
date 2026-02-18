import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { businessRuleValueLabel } from './helpers';
import type { BusinessEntity } from '@/types/businessRules';
import type { EditableRule } from '@/hooks/useBusinessRulesViewModel';
import { cn } from '@/lib/utils';

interface BusinessRulesRuleRowProps {
  rule: EditableRule;
  entities: BusinessEntity[];
  onChange: (updater: (rule: EditableRule) => EditableRule) => void;
  onRemove: () => void;
}

export function BusinessRulesRuleRow({ rule, entities, onChange, onRemove }: BusinessRulesRuleRowProps) {
  const [open, setOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleSave = () => {
    onChange(current => ({
      ...current,
      title: current.pendingTitle,
      description: current.pendingDescription,
      status: current.pendingStatus,
      tags: [...current.pendingTags],
      value: current.pendingValue,
      entities: current.pendingEntities,
      updatedAt: new Date().toISOString(),
    }));
    setOpen(false);
  };

  const handleValueChange = (value: string) => {
    let parsed: EditableRule['value'] = value;
    if (rule.valueType === 'number') {
      parsed = Number(value);
    } else if (rule.valueType === 'boolean') {
      parsed = value === 'true';
    } else if (rule.valueType === 'list') {
      parsed = value.split(',').map(item => item.trim()).filter(Boolean);
    } else if (rule.valueType === 'json') {
      try {
        parsed = JSON.parse(value || '{}');
      } catch (error) {
        parsed = value;
      }
    }

    onChange(current => ({ ...current, pendingValue: parsed }));
  };

  const renderValueInput = () => {
    const pending = rule.pendingValue;
    switch (rule.valueType) {
      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={Boolean(pending)}
              onCheckedChange={checked => onChange(current => ({ ...current, pendingValue: checked }))}
            />
            <span className="text-sm text-muted-foreground">{Boolean(pending) ? 'Ativo' : 'Inativo'}</span>
          </div>
        );
      case 'list':
        return (
          <Textarea
            value={(Array.isArray(pending) ? pending : []).join(', ')}
            onChange={e => handleValueChange(e.target.value)}
            placeholder="Digite valores separados por vírgula"
            className="min-h-[90px]"
          />
        );
      case 'json':
        return (
          <Textarea
            value={typeof pending === 'string' ? pending : JSON.stringify(pending, null, 2)}
            onChange={e => handleValueChange(e.target.value)}
            placeholder="Cole um JSON válido"
            className="font-mono text-xs min-h-[160px]"
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={typeof pending === 'number' ? pending : ''}
            onChange={e => handleValueChange(e.target.value)}
          />
        );
      default:
        return <Input value={typeof pending === 'string' ? pending : ''} onChange={e => handleValueChange(e.target.value)} />;
    }
  };

  const tagInputValue = rule.pendingTags.join(', ');
  const entityOptions = entities.filter(entity =>
    ['profile', 'team', 'form', 'lookup-table'].includes(entity.type)
  );

  return (
    <>
      <TableRow className="cursor-pointer" onClick={() => setOpen(true)}>
        <TableCell className="font-medium">{rule.title}</TableCell>
        <TableCell>
          <Badge variant={rule.status === 'active' ? 'outline' : 'secondary'} className={cn(rule.status === 'active' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-muted-foreground')}>
            {rule.status === 'active' ? 'Ativa' : 'Inativa'}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
          {businessRuleValueLabel(rule)}
        </TableCell>
        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
          {rule.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="mr-1">
              {tag}
            </Badge>
          ))}
        </TableCell>
      </TableRow>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>{rule.title}</DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              Editar regra e parâmetros locais (mocked). Salvamento apenas em memória.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-6 pb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={rule.pendingTitle}
                  onChange={e => onChange(current => ({ ...current, pendingTitle: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={rule.pendingStatus}
                  onValueChange={value => onChange(current => ({ ...current, pendingStatus: value as typeof current.pendingStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={rule.pendingDescription}
                onChange={e => onChange(current => ({ ...current, pendingDescription: e.target.value }))}
                placeholder="Descreva a regra de negócio"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor ({rule.valueType})</Label>
                {renderValueInput()}
              </div>
              <div className="space-y-2">
                <Label>Entidades relacionadas</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {(rule.pendingEntities?.length || 0) > 0
                        ? `${rule.pendingEntities?.length} selecionada(s)`
                        : 'Selecionar entidades'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto w-full">
                    {entityOptions.map(entity => {
                      const selected = (rule.pendingEntities || []).includes(entity.entityId);
                      return (
                        <DropdownMenuCheckboxItem
                          key={entity.entityId}
                          checked={selected}
                          onCheckedChange={checked => {
                            onChange(current => {
                              const currentEntities = new Set(current.pendingEntities || []);
                              if (checked) {
                                currentEntities.add(entity.entityId);
                              } else {
                                currentEntities.delete(entity.entityId);
                              }
                              return { ...current, pendingEntities: Array.from(currentEntities) };
                            });
                          }}
                        >
                          {entity.name}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (separadas por vírgula)</Label>
              <Input
                value={tagInputValue}
                onChange={e =>
                  onChange(current => ({
                    ...current,
                    pendingTags: e.target.value
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="ex: pipeline, tags, módulo"
              />
            </div>

            <div className="space-y-2">
              <Label>Última atualização</Label>
              <p className="text-sm text-muted-foreground">{new Date(rule.updatedAt).toLocaleString('pt-BR')}</p>
            </div>
          </div>

          <DrawerFooter className="gap-3">
            <div className="flex items-center justify-between">
              <Button
                variant={confirmingDelete ? 'destructive' : 'outline'}
                onClick={() => {
                  if (!confirmingDelete) {
                    setConfirmingDelete(true);
                    return;
                  }
                  onRemove();
                  setOpen(false);
                  setConfirmingDelete(false);
                }}
              >
                {confirmingDelete ? 'Confirmar exclusão' : 'Excluir regra'}
              </Button>
              <div className="flex gap-2">
                <DrawerClose asChild>
                  <Button variant="ghost">Cancelar</Button>
                </DrawerClose>
                <Button onClick={handleSave}>Salvar alterações</Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default BusinessRulesRuleRow;
