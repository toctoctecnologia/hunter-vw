import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageContainer from '@/components/ui/page-container';

interface LayoutPerfilProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

/**
 * Layout container for profile pages.
 * Provides consistent header and card styling.
 */
export default function LayoutPerfil({ title, description, icon, children }: LayoutPerfilProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <PageContainer className="py-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link
            to="/perfil"
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[hsl(var(--accent))]">
              {icon}
            </div>
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 p-6 md:p-8">
          <h1 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          {children}
        </div>
      </PageContainer>
    </div>
  );
}

