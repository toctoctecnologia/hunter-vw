import { type ChangeEventHandler, ReactNode, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StandardLayout } from './StandardLayout';
import { AlugueisNavigationTabs } from '@/components/gestao-locacao/AlugueisNavigationTabs';
import { RentalsSearchBar } from '@/components/gestao-locacao/RentalsSearchBar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

interface AlugueisLayoutProps {
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

export const AlugueisLayout = ({
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
  onClearFilters
}: AlugueisLayoutProps) => {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const searchValue = controlledSearchValue ?? internalSearchValue;
  const location = useLocation();
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInternalSearchValue(event.target.value);
    onSearchChange?.(event);
  };

  const currentSection = useMemo(() => {
    if (location.pathname.startsWith('/gestao-locacao/contratos')) return 'Contratos de aluguel';
    if (location.pathname.startsWith('/gestao-locacao/faturas')) return 'Boletos';
    if (location.pathname.startsWith('/gestao-locacao/repasses')) return 'Transferências';
    if (location.pathname.startsWith('/gestao-locacao/analises')) return 'Dados de aluguel';
    if (location.pathname.startsWith('/gestao-locacao/regua-cobranca')) return 'Agenda de cobrança';
    return 'Dashboard';
  }, [location.pathname]);

  return (
    <StandardLayout>
      <div className="gestao-locacao-theme p-6 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
                    <Link to="/gestao-locacao">Gestão de Aluguéis</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentSection}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold text-foreground mt-3">Gestão de Aluguéis</h1>
            <p className="text-sm text-[hsl(var(--textSecondary))] mt-1">
              Centro de controle operacional, financeiro e jurídico da sua carteira de aluguéis.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <RentalsSearchBar
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

          {/* Navigation Tabs */}
          <div className="mb-6">
            <AlugueisNavigationTabs />
          </div>

          {/* Content */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};

export default AlugueisLayout;
