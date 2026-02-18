import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { Shield } from 'lucide-react';

export default function PerfilSegurancaPage() {
  return (
    <LayoutPerfil
      icon={<Shield className="h-5 w-5 text-white" />}
      title="Segurança"
      description="Configurações de segurança do perfil"
    >
      <p className="text-gray-600">
        Configurações de segurança do perfil.
      </p>
    </LayoutPerfil>
  );
}

