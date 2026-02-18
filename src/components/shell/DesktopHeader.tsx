import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DesktopActionModal } from '@/components/common/DesktopActionModal';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

/**
 * Simple header bar shown on desktop pages with a "+" action button.
 */
export const DesktopHeader = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  if (isMobile) return null;
  return <>
      {/* Top header bar with action button */}
      

      <DesktopActionModal isOpen={open} onClose={() => setOpen(false)} />
    </>;
};
export default DesktopHeader;
