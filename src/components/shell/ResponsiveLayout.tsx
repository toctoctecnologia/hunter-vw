import { ReactNode } from 'react';
import AppLayout from '@/layouts/AppLayout';

interface ResponsiveLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick?: () => void;
  showTopBar?: boolean;
}

/**
 * Unified responsive layout that works for both mobile and desktop.
 * Shows sidebar navigation on desktop and bottom navigation on mobile.
 */
export const ResponsiveLayout = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onAddClick = () => {},
  showTopBar = true
}: ResponsiveLayoutProps) => {
  void setActiveTab;
  void onAddClick;
  void showTopBar;

  return <AppLayout initialActiveTab={activeTab}>{children}</AppLayout>;
};

export default ResponsiveLayout;
