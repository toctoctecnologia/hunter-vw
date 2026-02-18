import { ReactNode, useEffect, useState } from 'react';
import { MobileMenuContext } from '@/context/MobileMenuContext';
import { debugLog } from '@/utils/debug';
import { ActionModal } from '../common/ActionModal';
import { SidebarDrawer } from './SidebarDrawer';
import { ResponsiveNavigation } from '../navigation/ResponsiveNavigation';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { MobileAppBar } from '@/app-mobile/components/MobileAppBar';

interface MobileLayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddClick: () => void;
  title?: string;
}

export const MobileLayout = ({
  children,
  activeTab,
  setActiveTab,
  onAddClick,
  title
}: MobileLayoutProps) => {
  const [showActionModal, setShowActionModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ('Notification' in window && navigator.serviceWorker) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            debugLog('Push notifications enabled');
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker
                .register('/sw.js')
                .then(registration => {
                  debugLog('SW registered: ', registration);
                })
                .catch(registrationError => {
                  debugLog('SW registration failed: ', registrationError);
                });
            }
          }
        } catch (error) {
          debugLog('Error requesting notification permission:', error);
        }
      }
    };
    requestNotificationPermission();
  }, []);

  const handleAddClick = () => {
    setShowActionModal(true);
  };

  return (
    <MobileMenuContext.Provider value={{ openMenu: () => setShowMenu(true) }}>
      <div
        className={`bg-white relative overflow-hidden mx-auto w-full h-dvh ${
          isMobile ? 'flex flex-col' : 'flex'
        }`}
      >
      {/* Sidebar for desktop */}
      {!isMobile && (
        <div className="flex-shrink-0">
          <ResponsiveNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onAddClick={handleAddClick}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <SidebarDrawer isOpen={showMenu} onClose={() => setShowMenu(false)} />
        {isMobile && <MobileAppBar title={title} onOpenMenu={() => setShowMenu(true)} />}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">{children}</div>
        </div>
        {/* Bottom navigation for mobile */}
        {isMobile && (
          <div className="flex-shrink-0">
            <ResponsiveNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddClick={handleAddClick}
            />
          </div>
        )}
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
      />
    </div>
    </MobileMenuContext.Provider>
  );
};

export default MobileLayout;
