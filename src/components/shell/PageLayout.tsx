import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Generic page wrapper that applies horizontal padding only on web.
 */
export const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  const isMobile = useIsMobile();
  return (
    <div className={`w-full min-h-screen ${!isMobile ? 'px-4' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default PageLayout;
