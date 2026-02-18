import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { Cpu } from 'lucide-react';

export default function PerfilIAPage() {
  return (
    <LayoutPerfil
      icon={<Cpu className="h-5 w-5 text-white" />}
      title="IA"
      description="Configurações relacionadas à inteligência artificial"
    >
      <p className="text-gray-600">
        Configurações relacionadas à inteligência artificial.
      </p>
    </LayoutPerfil>
  );
}

