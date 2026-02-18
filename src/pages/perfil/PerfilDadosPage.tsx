import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { Database } from 'lucide-react';

export default function PerfilDadosPage() {
  return (
    <LayoutPerfil
      icon={<Database className="h-5 w-5 text-white" />}
      title="Dados"
      description="Gerenciamento de dados e privacidade"
    >
      <p className="text-gray-600">
        Gerenciamento de dados e privacidade.
      </p>
    </LayoutPerfil>
  );
}

