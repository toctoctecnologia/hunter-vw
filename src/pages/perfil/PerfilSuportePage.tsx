import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { LifeBuoy } from 'lucide-react';

export default function PerfilSuportePage() {
  return (
    <LayoutPerfil
      icon={<LifeBuoy className="h-5 w-5 text-white" />}
      title="Suporte"
      description="Obtenha ajuda e suporte"
    >
      <p className="text-gray-600">Obtenha ajuda e suporte.</p>
    </LayoutPerfil>
  );
}

