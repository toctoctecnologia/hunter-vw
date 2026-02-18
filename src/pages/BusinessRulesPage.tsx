import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { ResponsiveLayout } from '@/components/shell/ResponsiveLayout';
import PageContainer from '@/components/ui/page-container';
import { Button } from '@/components/ui/button';
import { BusinessRulesSearchBar } from '@/components/business-rules/BusinessRulesSearchBar';
import { useBusinessRulesViewModel } from '@/hooks/useBusinessRulesViewModel';
import BusinessRulesCategoryIndex from '@/components/business-rules/BusinessRulesCategoryIndex';
import BusinessRulesModuleGrid from '@/components/business-rules/BusinessRulesModuleGrid';
import BusinessRulesModuleDrawer from '@/components/business-rules/BusinessRulesModuleDrawer';
import type { BusinessModule } from '@/types/businessRules';
import { initialAuxTables, initialDadosConfig, initialFormConfigs, initialFunilConfig } from '@/mocks/business-rules/configs';
import { Badge } from '@/components/ui/badge';

export function BusinessRulesPage() {
  const {
    filteredModules,
    rulesByModule,
    categories,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    editableFilter,
    setEditableFilter,
  } = useBusinessRulesViewModel();

  const [activeCategory, setActiveCategory] = useState<BusinessModule['categoryId']>('dados');
  const [selectedModule, setSelectedModule] = useState<BusinessModule | null>(null);

  const [dadosConfig, setDadosConfig] = useState(initialDadosConfig);
  const [funilConfig, setFunilConfig] = useState(initialFunilConfig);
  const [auxTables, setAuxTables] = useState(initialAuxTables);
  const [formConfigs, setFormConfigs] = useState(initialFormConfigs);

  useEffect(() => {
    if (filteredModules.length === 0) return;
    const hasActive = filteredModules.some(module => module.categoryId === activeCategory);
    if (!hasActive) {
      setActiveCategory(filteredModules[0].categoryId);
    }
  }, [filteredModules, activeCategory]);

  const categoriesSummary = useMemo(
    () =>
      categories.map(category => {
        const categoryModules = filteredModules.filter(module => module.categoryId === category.id);
        const rulesCount = categoryModules.reduce(
          (acc, module) => acc + (rulesByModule[module.moduleId]?.length || 0),
          0
        );
        return {
          ...category,
          modulesCount: categoryModules.length,
          rulesCount,
        };
      }),
    [categories, filteredModules, rulesByModule]
  );

  const modulesByCategory = filteredModules.filter(module => module.categoryId === activeCategory);

  const handleSelectCategory = (categoryId: BusinessModule['categoryId'] | 'all') => {
    setCategoryFilter(categoryId);
    if (categoryId === 'all') {
      if (filteredModules[0]) {
        setActiveCategory(filteredModules[0].categoryId);
      }
      return;
    }
    setActiveCategory(categoryId);
  };

  return (
    <ResponsiveLayout activeTab="business-rules" setActiveTab={() => {}}>
      <PageContainer className="py-8 space-y-6">
        <header className="space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-2">
              <Badge variant="outline" className="text-[11px] uppercase tracking-[0.16em]">
                Operações · Regras de Negócios
              </Badge>
              <div>
                <h1 className="text-3xl font-bold leading-tight">Regras de Negócio</h1>
                <p className="text-sm text-muted-foreground max-w-3xl">
                  Camada premium para navegar por categorias, módulos e regras. Filtre, edite e valide
                  rapidamente sem sair do contexto.
                </p>
              </div>
            </div>
            <Button className="gap-2" size="lg">
              <Plus className="h-4 w-4" /> Nova regra
            </Button>
          </div>

          <BusinessRulesSearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={handleSelectCategory}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            editableFilter={editableFilter}
            onEditableFilterChange={setEditableFilter}
            categories={categories}
          />
        </header>

        <div className="space-y-4">
          <BusinessRulesCategoryIndex
            categories={categoriesSummary}
            activeCategoryId={activeCategory}
            onSelect={handleSelectCategory}
          />

          <BusinessRulesModuleGrid modules={modulesByCategory} onSelect={setSelectedModule} />
        </div>
      </PageContainer>

      <BusinessRulesModuleDrawer
        module={selectedModule}
        open={Boolean(selectedModule)}
        onOpenChange={open => !open && setSelectedModule(null)}
        rules={selectedModule ? rulesByModule[selectedModule.moduleId] : []}
        dadosConfig={dadosConfig}
        onDadosConfigChange={setDadosConfig}
        funilConfig={funilConfig}
        onFunilConfigChange={setFunilConfig}
        auxTables={auxTables}
        onAuxTablesChange={setAuxTables}
        formConfigs={formConfigs}
        onFormConfigsChange={setFormConfigs}
      />
    </ResponsiveLayout>
  );
}

export default BusinessRulesPage;
