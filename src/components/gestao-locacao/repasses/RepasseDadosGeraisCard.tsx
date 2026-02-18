import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CalendarIcon, Pencil, User, Building, FileText, CreditCard, Banknote } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export interface RepasseDadosGerais {
  locador: { id: string; nome: string };
  imovel: { id: string; tipo: string; endereco: string };
  contrato: { id: string; codigo: string };
  competencia: string;
  dataPrevistaRepasse: string;
  dataPagamento?: string;
  metodoRepasse: string;
  contaDestino: {
    banco: string;
    agencia: string;
    conta: string;
    chavePix?: string;
  };
}

interface RepasseDadosGeraisCardProps {
  dados: RepasseDadosGerais;
  onSave: (dados: RepasseDadosGerais) => void;
  status: string;
}

export function RepasseDadosGeraisCard({ dados, onSave, status }: RepasseDadosGeraisCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<RepasseDadosGerais>(dados);
  const [dataPrevista, setDataPrevista] = useState<Date | undefined>(
    dados.dataPrevistaRepasse ? new Date(dados.dataPrevistaRepasse.split('/').reverse().join('-')) : undefined
  );

  const handleSave = () => {
    onSave({
      ...editData,
      dataPrevistaRepasse: dataPrevista ? format(dataPrevista, 'dd/MM/yyyy', { locale: ptBR }) : editData.dataPrevistaRepasse,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(dados);
    setDataPrevista(dados.dataPrevistaRepasse ? new Date(dados.dataPrevistaRepasse.split('/').reverse().join('-')) : undefined);
    setIsEditing(false);
  };

  const isPago = status === 'Pago';

  return (
    <>
      <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Dados gerais
            </CardTitle>
            {!isPago && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-[hsl(var(--link))] hover:bg-[hsl(var(--accent))]/10 rounded-lg"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Editar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Locador */}
            <div className="space-y-1">
              <p className="text-xs text-[var(--ui-text-subtle)] flex items-center gap-1">
                <User className="w-3 h-3" />
                Locador
              </p>
              <Link
                to={`/pessoas/${dados.locador.id}`}
                className="text-sm font-medium text-[hsl(var(--link))] hover:underline"
              >
                {dados.locador.nome}
              </Link>
            </div>

            {/* Imóvel */}
            <div className="space-y-1">
              <p className="text-xs text-[var(--ui-text-subtle)] flex items-center gap-1">
                <Building className="w-3 h-3" />
                Imóvel
              </p>
              <Link
                to={`/property/${dados.imovel.id}`}
                className="text-sm font-medium text-[hsl(var(--link))] hover:underline"
              >
                {dados.imovel.tipo} | {dados.imovel.endereco}
              </Link>
            </div>

            {/* Contrato */}
            <div className="space-y-1">
              <p className="text-xs text-[var(--ui-text-subtle)] flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Contrato
              </p>
              <Link
                to={`/gestao-locacao/contratos/${dados.contrato.id}`}
                className="text-sm font-medium text-[hsl(var(--link))] hover:underline"
              >
                {dados.contrato.codigo}
              </Link>
            </div>

            {/* Competência */}
            <div className="space-y-1">
              <p className="text-xs text-[var(--ui-text-subtle)] flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                Competência
              </p>
              <p className="text-sm font-medium text-[var(--ui-text)]">{dados.competencia}</p>
            </div>

            {/* Data Prevista */}
            <div className="space-y-1">
              <p className="text-xs text-[var(--ui-text-subtle)] flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                Data prevista de transferência
              </p>
              <p className="text-sm font-medium text-[var(--ui-text)]">{dados.dataPrevistaRepasse}</p>
            </div>

            {/* Data Pagamento */}
            {dados.dataPagamento && (
              <div className="space-y-1">
                <p className="text-xs text-[var(--ui-text-subtle)] flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  Data de pagamento efetivo
                </p>
                <p className="text-sm font-medium text-[hsl(var(--success))]">{dados.dataPagamento}</p>
              </div>
            )}

            {/* Método */}
            <div className="space-y-1">
              <p className="text-xs text-[var(--ui-text-subtle)] flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                Método de transferência
              </p>
              <p className="text-sm font-medium text-[var(--ui-text)]">{dados.metodoRepasse}</p>
            </div>

            {/* Conta Destino */}
            <div className="space-y-1">
              <p className="text-xs text-[var(--ui-text-subtle)] flex items-center gap-1">
                <Banknote className="w-3 h-3" />
                Conta de destino
              </p>
              <p className="text-sm font-medium text-[var(--ui-text)]">
                {dados.contaDestino.banco} | Ag: {dados.contaDestino.agencia} | Conta: ***{dados.contaDestino.conta.slice(-4)}
              </p>
              {dados.contaDestino.chavePix && (
                <p className="text-xs text-[var(--ui-text-subtle)]">
                  PIX: {dados.contaDestino.chavePix}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[var(--ui-text)]">Editar dados gerais</DialogTitle>
            <DialogDescription className="text-[var(--ui-text-subtle)]">
              Atualize as informações da transferência conforme necessário.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Competência</Label>
              <Input
                value={editData.competencia}
                onChange={(e) => setEditData({ ...editData, competencia: e.target.value })}
                className="h-11 rounded-xl border-[var(--ui-stroke)]"
                placeholder="Ex: Novembro 2024"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Data prevista de transferência</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full h-11 rounded-xl border-[var(--ui-stroke)] justify-start text-left font-normal',
                      !dataPrevista && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataPrevista ? format(dataPrevista, "dd/MM/yyyy", { locale: ptBR }) : 'Selecione uma data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={dataPrevista}
                    onSelect={setDataPrevista}
                    initialFocus
                    className="pointer-events-auto"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Método de transferência</Label>
              <Select
                value={editData.metodoRepasse}
                onValueChange={(v) => setEditData({ ...editData, metodoRepasse: v })}
              >
                <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Conta digital Hunter">Conta digital Hunter</SelectItem>
                  <SelectItem value="TED bancária">TED bancária</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Transferência manual">Transferência manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Banco</Label>
              <Select
                value={editData.contaDestino.banco}
                onValueChange={(v) => setEditData({
                  ...editData,
                  contaDestino: { ...editData.contaDestino, banco: v }
                })}
              >
                <SelectTrigger className="h-11 rounded-xl border-[var(--ui-stroke)]">
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Banco Atlântico">Banco Atlântico</SelectItem>
                  <SelectItem value="Banco Horizonte">Banco Horizonte</SelectItem>
                  <SelectItem value="Banco Aurora">Banco Aurora</SelectItem>
                  <SelectItem value="Banco Sol">Banco Sol</SelectItem>
                  <SelectItem value="Banco Norte">Banco Norte</SelectItem>
                  <SelectItem value="Banco Sul">Banco Sul</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Agência</Label>
                <Input
                  value={editData.contaDestino.agencia}
                  onChange={(e) => setEditData({
                    ...editData,
                    contaDestino: { ...editData.contaDestino, agencia: e.target.value }
                  })}
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                  placeholder="0000"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[var(--ui-text)]">Conta</Label>
                <Input
                  value={editData.contaDestino.conta}
                  onChange={(e) => setEditData({
                    ...editData,
                    contaDestino: { ...editData.contaDestino, conta: e.target.value }
                  })}
                  className="h-11 rounded-xl border-[var(--ui-stroke)]"
                  placeholder="00000-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[var(--ui-text)]">Chave PIX (opcional)</Label>
              <Input
                value={editData.contaDestino.chavePix || ''}
                onChange={(e) => setEditData({
                  ...editData,
                  contaDestino: { ...editData.contaDestino, chavePix: e.target.value }
                })}
                className="h-11 rounded-xl border-[var(--ui-stroke)]"
                placeholder="CPF, e-mail, telefone ou chave aleatória"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-xl border-[var(--ui-stroke)]"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-xl bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))]"
            >
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RepasseDadosGeraisCard;
