import { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';

interface DesktopLayoutProps {
  children: ReactNode;
  activeTab: string;
  showTopBar?: boolean;
}

/**
 * Layout wrapper optimized for desktop screens with sidebar navigation.
 * It renders the provided content next to the sidebar.
 */
export const DesktopLayout = ({ children, activeTab }: DesktopLayoutProps) => (
  <AppLayout initialActiveTab={activeTab}>{children}</AppLayout>
);

export default DesktopLayout;
