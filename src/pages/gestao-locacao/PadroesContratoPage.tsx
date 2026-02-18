import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocacaoModuleLayout } from '@/layouts/LocacaoModuleLayout';
import { VendasModuleLayout } from '@/layouts/VendasModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  FileText,
  Edit,
  Trash2,
  Copy,
  MoreHorizontal,
  Search
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  type ContractPattern,
  listContractPatterns,
  saveContractPatterns,
} from '@/services/gestao-locacao/contractPatternsStorage';

export const PadroesContratoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSalesContext = location.pathname.startsWith('/gestao-vendas');
  const basePath = isSalesContext ? '/gestao-vendas/padroes-contrato' : '/gestao-locacao/padroes-contrato';
  const contractType = isSalesContext ? 'venda' : 'locacao';
  const [padroes, setPadroes] = useState<ContractPattern[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [padraoToDelete, setPadraoToDelete] = useState<string | null>(null);

  useEffect(() => {
    setPadroes(listContractPatterns());
  }, []);

  const handleCreateNew = () => navigate(`${basePath}/novo/editar`);
  const handleEdit = (padrao: ContractPattern) => navigate(`${basePath}/${padrao.id}/editar`);
  const handleDelete = (id: string) => { setPadraoToDelete(id); setDeleteDialogOpen(true); };
  const confirmDelete = () => {
    if (padraoToDelete) {
      setPadroes(prev => {
        const next = prev.filter(p => p.id !== padraoToDelete);
        saveContractPatterns(next);
        return next;
      });
      toast.success('Padrão excluído');
    }
    setDeleteDialogOpen(false); setPadraoToDelete(null);
  };
  const handleDuplicate = (padrao: ContractPattern) => {
    setPadroes(prev => {
      const next = [{ ...padrao, id: String(Date.now()), nome: `${padrao.nome} (cópia)` }, ...prev];
      saveContractPatterns(next);
      return next;
    });
    toast.success('Padrão duplicado');
  };

  const filteredPadroes = padroes.filter((p) => p.tipoContrato === contractType && p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  const Layout = isSalesContext ? VendasModuleLayout : LocacaoModuleLayout;

  return (
    <Layout
      title="Padrões de Contrato"
      subtitle="Crie e gerencie modelos de contrato com campos dinâmicos"
      showTabs={isSalesContext}
    >
      {/* Header Actions */}
      <div className="flex justify-end mb-6">
        <Button onClick={handleCreateNew} className="rounded-xl h-11 px-5 bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] shadow-lg shadow-[var(--brand-focus)]">
          <Plus className="w-4 h-4 mr-2" />
          Novo Padrão
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6 rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ui-text-subtle)]" />
            <Input 
              placeholder="Buscar padrão..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10 h-11 rounded-xl border-[var(--ui-stroke)]" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPadroes.map((padrao) => (
          <Card key={padrao.id} className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)] hover:shadow-md transition-all group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => handleEdit(padrao)}>
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))]/10 flex items-center justify-center group-hover:bg-[hsl(var(--accent))]/20 transition-colors">
                    <FileText className="w-5 h-5 text-[hsl(var(--accent))]" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-[var(--ui-text)] group-hover:text-[hsl(var(--accent))] transition-colors">{padrao.nome}</CardTitle>
                    <Badge className={`mt-1 text-xs ${padrao.ativo ? 'bg-[hsl(var(--success)/0.18)] text-[hsl(var(--success))]' : 'bg-[var(--ui-stroke)] text-[var(--ui-text-subtle)]'} border-0`}>
                      {padrao.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onClick={() => handleEdit(padrao)} className="cursor-pointer"><Edit className="w-4 h-4 mr-2" />Editar modelo</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(padrao)} className="cursor-pointer"><Copy className="w-4 h-4 mr-2" />Duplicar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(padrao.id)} className="cursor-pointer text-[hsl(var(--danger))]"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm cursor-pointer" onClick={() => handleEdit(padrao)}>
                <div className="flex justify-between"><span className="text-[var(--ui-text-subtle)]">Tipo de contrato</span><span className="text-[var(--ui-text)] font-medium">{padrao.tipoContrato === 'locacao' ? 'Contrato de locação' : 'Contrato de venda'}</span></div>
                {padrao.tipoContrato === 'locacao' ? (
                  <>
                    <div className="flex justify-between"><span className="text-[var(--ui-text-subtle)]">Duração</span><span className="text-[var(--ui-text)] font-medium">{padrao.duracao ?? '-'}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--ui-text-subtle)]">Índice</span><span className="text-[var(--ui-text)] font-medium">{padrao.indiceReajuste ?? '-'}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--ui-text-subtle)]">Taxa Adm.</span><span className="text-[var(--ui-text)] font-medium">{padrao.taxaAdm ?? '-'}</span></div>
                    <div className="flex justify-between"><span className="text-[var(--ui-text-subtle)]">Garantia</span><span className="text-[var(--ui-text)] font-medium">{padrao.garantia ?? '-'}</span></div>
                  </>
                ) : (
                  <div className="flex justify-between"><span className="text-[var(--ui-text-subtle)]">Índice de correção</span><span className="text-[var(--ui-text)] font-medium">{padrao.indiceCorrecao ?? '-'}</span></div>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={() => handleEdit(padrao)} 
                className="w-full mt-4 rounded-xl h-10 border-[var(--ui-stroke)] text-[var(--ui-text)] hover:bg-[hsl(var(--accent))]/5 hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar modelo
              </Button>
            </CardContent>
          </Card>
        ))}
        {filteredPadroes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--ui-stroke)]/50 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-[var(--ui-text-subtle)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--ui-text)] mb-1">Nenhum padrão encontrado</h3>
            <p className="text-sm text-[var(--ui-text-subtle)] mb-4 max-w-sm">{searchTerm ? 'Tente outros termos.' : 'Crie seu primeiro padrão.'}</p>
            <Button onClick={handleCreateNew} className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]">
              <Plus className="w-4 h-4 mr-2" />
              Criar padrão
            </Button>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir padrão?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-xl bg-[hsl(var(--danger))] hover:bg-[hsl(var(--danger))]/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default PadroesContratoPage;
