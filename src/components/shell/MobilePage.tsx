import { ReactNode } from 'react';
import PageLayout from './PageLayout';

interface MobilePageProps {
  children: ReactNode;
  className?: string;
}

/**
 * Page wrapper optimized for mobile screens.
 * It occupies the full viewport without horizontal margins.
 */
export const MobilePage = ({ children, className = '' }: MobilePageProps) => (
  <PageLayout className={`bg-gray-50 flex flex-col ${className}`}>{children}</PageLayout>
);

export default MobilePage;
