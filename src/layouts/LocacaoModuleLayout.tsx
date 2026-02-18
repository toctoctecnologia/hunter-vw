import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StandardLayout } from '@/layouts/StandardLayout';
import { LocacaoTopTabs } from './LocacaoTopTabs';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface LocacaoModuleLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbItems?: BreadcrumbItem[];
  showTabs?: boolean;
}

export function LocacaoModuleLayout({ 
  children, 
  title,
  subtitle,
  breadcrumbItems,
  showTabs = true
}: LocacaoModuleLayoutProps) {
  const location = useLocation();
  
  // Default breadcrumb based on current path
  const getDefaultBreadcrumb = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const items: BreadcrumbItem[] = [
      { label: 'INÍCIO', href: '/gestao-locacao' },
      { label: 'CONTRATOS DE LOCAÇÃO', href: '/gestao-locacao/contratos' }
    ];

    if (path.includes('/padroes-contrato')) {
      items.push({ label: 'PADRÕES DE CONTRATO' });
    } else if (path.includes('/reajustes')) {
      items.push({ label: 'REAJUSTES' });
    } else if (path.includes('/dimob')) {
      items.push({ label: 'DIMOB' });
    } else if (path.includes('/seguros')) {
      items.push({ label: 'SEGUROS' });
    }

    return items;
  };

  const breadcrumb = breadcrumbItems || getDefaultBreadcrumb();

  return (
    <StandardLayout>
      <div className="gestao-locacao-theme p-6 bg-[var(--ui-surface)] min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--ui-text-subtle)] mb-6">
            {breadcrumb.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <span>›</span>}
                {item.href ? (
                  <Link 
                    to={item.href} 
                    className="hover:text-[var(--ui-text)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[var(--ui-text)] font-medium">{item.label}</span>
                )}
              </div>
            ))}
          </div>

          {/* Top Tabs - Always visible */}
          {showTabs && (
            <div className="mb-8">
              <LocacaoTopTabs />
            </div>
          )}

          {/* Optional Header */}
          {(title || subtitle) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold text-[var(--ui-text)]">{title}</h1>}
              {subtitle && <p className="text-sm text-[hsl(var(--textSecondary))] mt-1">{subtitle}</p>}
            </div>
          )}

          {/* Page Content */}
          {children}
        </div>
      </div>
    </StandardLayout>
  );
}

export default LocacaoModuleLayout;
