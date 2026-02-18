import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { MobileBottomBar } from '@/app-mobile/navigation/MobileBottomBar';
import { SidebarNav } from './SidebarNav';

interface ResponsiveNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ResponsiveNavigation(props: ResponsiveNavigationProps) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <div className="relative">
      <MobileBottomBar />
      <button
        onClick={props.onAddClick}
        className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform duration-150 z-20"
        style={{ boxShadow: '0 4px 12px rgba(255, 102, 0, 0.3)' }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-white"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  ) : (
    <SidebarNav
      {...props}
      isOpen={props.isOpen || true}
      isCollapsed={false}
      onClose={props.onClose || (() => {})}
    />
  );
}

export default ResponsiveNavigation;
