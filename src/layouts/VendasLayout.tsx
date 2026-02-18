import { type ChangeEventHandler, ReactNode, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StandardLayout } from './StandardLayout';
import { VendasNavigationTabs } from '@/components/gestao-vendas/VendasNavigationTabs';
import { SalesSearchBar } from '@/components/gestao-vendas/SalesSearchBar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface VendasLayoutProps {
  children: ReactNode;
  searchValue?: string;
  onSearchChange?: ChangeEventHandler<HTMLInputElement>;
  searchPlaceholder?: string;
  filtersContent?: ReactNode;
  filtersTitle?: string;
  filtersDescription?: string;
  filtersCount?: number;
  hasActiveFilters?: boolean;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
}

export const VendasLayout = ({
  children,
  searchValue: controlledSearchValue,
  onSearchChange,
  searchPlaceholder,
  filtersContent,
  filtersTitle,
  filtersDescription,
  filtersCount,
  hasActiveFilters,
  onApplyFilters,
  onClearFilters,
}: VendasLayoutProps) => {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const searchValue = controlledSearchValue ?? internalSearchValue;
  const location = useLocation();
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInternalSearchValue(event.target.value);
    onSearchChange?.(event);
  };

  const currentSection = useMemo(() => {
    if (location.pathname.startsWith('/gestao-vendas/contratos')) return 'Contratos de venda';
    if (location.pathname.startsWith('/gestao-vendas/recebimentos')) return 'Comissões';
    if (location.pathname.startsWith('/gestao-vendas/comissoes')) return 'Comissões';
    if (location.pathname.startsWith('/gestao-vendas/transferencias')) return 'Transferências';
    if (location.pathname.startsWith('/gestao-vendas/dados')) return 'Dashboard';
    if (location.pathname.startsWith('/gestao-vendas/agenda')) return 'Agenda da venda';
    if (location.pathname.startsWith('/gestao-vendas/documentos')) return 'Documentos';
    return 'Dashboard';
  }, [location.pathname]);

  return (
    <StandardLayout>
      <div className="gestao-vendas-theme p-6 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Início</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/gestao-vendas">Gestão de Vendas</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentSection}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold text-foreground mt-3">Gestão de Vendas</h1>
            <p className="text-sm text-[hsl(var(--textSecondary))] mt-1">
              Centro de controle comercial, operacional e jurídico da sua carteira de vendas imobiliárias.
            </p>
          </div>

          <div className="mb-6">
            <SalesSearchBar
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={handleSearchChange}
              filtersContent={filtersContent}
              filtersTitle={filtersTitle}
              filtersDescription={filtersDescription}
              filtersCount={filtersCount}
              hasActiveFilters={hasActiveFilters}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
            />
          </div>

          <div className="mb-6">
            <VendasNavigationTabs />
          </div>

          <div>{children}</div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default VendasLayout;
