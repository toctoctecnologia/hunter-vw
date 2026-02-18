import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StandardLayout } from '@/layouts/StandardLayout';
import { VendasTopTabs } from './VendasTopTabs';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface VendasModuleLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbItems?: BreadcrumbItem[];
  showTabs?: boolean;
}

export function VendasModuleLayout({
  children,
  title,
  subtitle,
  breadcrumbItems,
  showTabs = false,
}: VendasModuleLayoutProps) {
  const location = useLocation();

  const getDefaultBreadcrumb = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const items: BreadcrumbItem[] = [
      { label: 'INÍCIO', href: '/gestao-vendas' },
      { label: 'CONTRATOS DE VENDA', href: '/gestao-vendas/contratos' },
    ];

    if (path.includes('/documentos')) {
      items.push({ label: 'DOCUMENTOS' });
    } else if (path.includes('/padroes-contrato')) {
      items.push({ label: 'PADRÕES DE CONTRATO' });
    }

    return items;
  };

  const breadcrumb = breadcrumbItems || getDefaultBreadcrumb();

  return (
    <StandardLayout>
      <div className="gestao-vendas-theme p-6 bg-[var(--ui-surface)] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)] mb-6">
            {breadcrumb.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span>›</span>}
                {item.href ? (
                  <Link to={item.href} className="hover:text-[var(--ui-text)] transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[var(--ui-text)] font-medium">{item.label}</span>
                )}
              </div>
            ))}
          </div>

          {showTabs && (
            <div className="mb-8">
              <VendasTopTabs />
            </div>
          )}

          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold text-[var(--ui-text)]">{title}</h1>}
              {subtitle && <p className="text-sm text-[hsl(var(--textSecondary))] mt-1">{subtitle}</p>}
            </div>
          )}

          {children}
        </div>
      </div>
    </StandardLayout>
  );
}

export default VendasModuleLayout;
