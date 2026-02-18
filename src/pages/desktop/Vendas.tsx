import { VendasTab } from '@/components/vendas/VendasTab';
import DesktopLayout from '@/components/shell/DesktopLayout';
import DesktopHeader from '@/components/shell/DesktopHeader';

export default function DesktopVendas() {
  return (
    <DesktopLayout activeTab="vendas">
      <DesktopHeader />
      <VendasTab />
    </DesktopLayout>
  );
}
