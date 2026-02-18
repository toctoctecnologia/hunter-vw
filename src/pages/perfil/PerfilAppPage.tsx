import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { Smartphone } from 'lucide-react';

export default function PerfilAppPage() {
  return (
    <LayoutPerfil
      icon={<Smartphone className="h-5 w-5 text-white" />}
      title="App"
      description="Preferências do aplicativo"
    >
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-400">
        Configurações do aplicativo serão exibidas aqui.
      </div>
    </LayoutPerfil>
  );
}

