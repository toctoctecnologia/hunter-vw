import { ArrowRight, Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { BusinessModule } from '@/types/businessRules';

interface BusinessRulesModuleGridProps {
  modules: BusinessModule[];
  onSelect: (module: BusinessModule) => void;
}

export function BusinessRulesModuleGrid({ modules, onSelect }: BusinessRulesModuleGridProps) {
  if (modules.length === 0) {
    return (
      <Card className="p-6 text-center border-dashed">
        <p className="text-sm font-semibold text-muted-foreground">Nenhum módulo encontrado com os filtros atuais.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Ajuste a busca, selecione outra categoria ou limpe os filtros para visualizar novamente.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {modules.map(module => (
        <Card key={module.moduleId} className="flex flex-col gap-3 p-4 border border-border/80 bg-card shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold">{module.title}</p>
              <p className="text-xs text-muted-foreground">{module.description}</p>
            </div>
            <Badge variant="outline" className="text-[11px] font-medium">
              {module.itemsCount ?? 0} itens
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-[11px]">
              {module.moduleType}
            </Badge>
            {module.badges?.map(badge => (
              <Badge key={badge} variant="outline" className="text-[11px]">
                {badge}
              </Badge>
            ))}
            {module.editable ? (
              <Badge variant="outline" className="text-[11px] text-emerald-600 border-emerald-200 bg-emerald-50">
                Editável
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[11px] text-muted-foreground">
                Somente leitura
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Atualizado em {new Date(module.updatedAt).toLocaleDateString('pt-BR')}</span>
            {module.updatedBy && <span>por {module.updatedBy}</span>}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            {module.tags.map(tag => (
              <span key={tag} className={cn('rounded-full bg-muted px-3 py-1')}>
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <Button variant="ghost" className="px-0 text-primary hover:text-primary" onClick={() => onSelect(module)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Ver e editar
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => onSelect(module)}>
              Abrir módulo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default BusinessRulesModuleGrid;
