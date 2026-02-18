import { useState } from 'react';
import { Building2, Save, Loader2 } from 'lucide-react';
import LayoutPerfil from '@/components/perfil/LayoutPerfil';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useToast } from '@/hooks/use-toast';

export default function PerfilNegocioEmpresaPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomeEmpresa: 'Imobiliária TocToc',
    responsavel: 'João Silva',
    documento: '12.345.678/0001-90',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: 'Dados salvos',
        description: 'Informações da empresa atualizadas com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as informações.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value);
    setFormData(prev => ({ ...prev, documento: formatted }));
  };

  return (
    <LayoutPerfil
      icon={<Building2 className="h-5 w-5 text-white" />}
      title="Dados da Empresa"
      description="Gerencie os dados da sua empresa"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
          <Input
            id="nomeEmpresa"
            value={formData.nomeEmpresa}
            onChange={(e) => setFormData(prev => ({ ...prev, nomeEmpresa: e.target.value }))}
            placeholder="Digite o nome da empresa"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsavel">Responsável</Label>
          <Input
            id="responsavel"
            value={formData.responsavel}
            onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
            placeholder="Nome do responsável"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documento">CPF/CNPJ</Label>
          <Input
            id="documento"
            value={formData.documento}
            onChange={handleDocumentChange}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            maxLength={18}
          />
        </div>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </PrimaryButton>
      </form>
    </LayoutPerfil>
  );
}

