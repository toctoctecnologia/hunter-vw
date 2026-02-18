import { ServicosTab } from '@/components/agenda/ServicosTab';
import DesktopLayout from '@/components/shell/DesktopLayout';
import DesktopHeader from '@/components/shell/DesktopHeader';

export default function DesktopServicos() {
  return (
    <DesktopLayout activeTab="gerenciamentodeservicos" showTopBar={false}>
      <DesktopHeader />
      <ServicosTab />
    </DesktopLayout>
  );
}
