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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { FileText, Pencil, X, Check, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface FaturaDadosGerais {
  numero: string;
  contrato: {
    id: string;
    codigo: string;
  };
  locatario: {
    nome: string;
    email: string;
    telefone: string;
  };
  imovel: {
    tipo: string;
    endereco: string;
  };
  competencia: string;
  dataEmissao: string;
  dataVencimento: string;
  metodoPagamento: string;
  statusConciliacao?: string;
  responsavelAlteracao?: string;
  dataAlteracao?: string;
}

interface FaturaDadosGeraisCardProps {
  dados: FaturaDadosGerais;
  onSave: (dados: FaturaDadosGerais) => void;
}

const metodoPagamentoOptions = [
  { value: 'boleto', label: 'Boleto bancário' },
  { value: 'pix', label: 'Pix' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'cartao', label: 'Cartão' },
];

const statusConciliacaoOptions = [
  { value: 'nao_enviado', label: 'Não enviado ao banco' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'registrado', label: 'Registrado' },
  { value: 'baixado', label: 'Baixado' },
];

// Mock contracts for selection
const contratosDisponiveis = [
  { id: '1', codigo: '2093477/1' },
  { id: '2', codigo: '2093478/2' },
  { id: '3', codigo: '2093479/3' },
];

// Mock tenants
const locatariosDisponiveis = [
  { id: '1', nome: 'Luiz Victor Ferreira' },
  { id: '2', nome: 'Carolina Lima' },
  { id: '3', nome: 'Felipe Rocha' },
];

export const FaturaDadosGeraisCard = ({ dados, onSave }: FaturaDadosGeraisCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(dados);
  const [vencimentoDate, setVencimentoDate] = useState<Date | undefined>(
    dados.dataVencimento ? new Date(dados.dataVencimento.split('/').reverse().join('-')) : undefined
  );
  const [emissaoDate, setEmissaoDate] = useState<Date | undefined>(
    dados.dataEmissao ? new Date(dados.dataEmissao.split('/').reverse().join('-')) : undefined
  );

  const handleEdit = () => {
    setEditData(dados);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(dados);
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: Add validation
    onSave({
      ...editData,
      dataVencimento: vencimentoDate ? format(vencimentoDate, 'dd/MM/yyyy') : editData.dataVencimento,
      dataEmissao: emissaoDate ? format(emissaoDate, 'dd/MM/yyyy') : editData.dataEmissao,
    });
    setIsEditing(false);
  };

  const handleContratoChange = (contratoId: string) => {
    const contrato = contratosDisponiveis.find(c => c.id === contratoId);
    if (contrato) {
      setEditData(prev => ({
        ...prev,
        contrato: { id: contrato.id, codigo: contrato.codigo }
      }));
    }
  };

  const handleLocatarioChange = (locatarioNome: string) => {
    const locatario = locatariosDisponiveis.find(l => l.nome === locatarioNome);
    if (locatario) {
      setEditData(prev => ({
        ...prev,
        locatario: { ...prev.locatario, nome: locatario.nome }
      }));
    }
  };

  return (
    <Card className="rounded-2xl border-[var(--ui-stroke)] shadow-[var(--shadow-sm)]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-[var(--ui-text)] flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Dados gerais
          </CardTitle>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-[var(--ui-text-subtle)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-stroke)]/50 rounded-lg"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Editar
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-[var(--ui-text-subtle)] hover:text-[var(--ui-text)] hover:bg-[var(--ui-stroke)]/50 rounded-lg"
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90 text-[hsl(var(--brandPrimaryText))] rounded-lg"
              >
                <Check className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Número do boleto */}
          <div className="space-y-1">
            <Label className="text-xs text-[var(--ui-text-subtle)]">Número do boleto</Label>
            {isEditing ? (
              <Input
                value={editData.numero}
                onChange={(e) => setEditData(prev => ({ ...prev, numero: e.target.value }))}
                className="rounded-xl border-[var(--ui-stroke)] h-10"
              />
            ) : (
              <p className="text-sm font-medium text-[var(--ui-text)]">{dados.numero}</p>
            )}
          </div>

          {/* Contrato */}
          <div className="space-y-1">
            <Label className="text-xs text-[var(--ui-text-subtle)]">Contrato</Label>
            {isEditing ? (
              <Select
                value={editData.contrato.id}
                onValueChange={handleContratoChange}
              >
                <SelectTrigger className="rounded-xl border-[var(--ui-stroke)] h-10">
                  <SelectValue placeholder="Selecione um contrato" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {contratosDisponiveis.map(contrato => (
                    <SelectItem key={contrato.id} value={contrato.id} className="rounded-lg">
                      {contrato.codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Link
                to={`/gestao-locacao/contratos/${dados.contrato.id}`}
                className="text-sm font-medium text-[hsl(var(--link))] hover:underline"
              >
                {dados.contrato.codigo}
              </Link>
            )}
          </div>

          {/* Locatário */}
          <div className="space-y-1">
            <Label className="text-xs text-[var(--ui-text-subtle)]">Locatário</Label>
            {isEditing ? (
              <Select
                value={editData.locatario.nome}
                onValueChange={handleLocatarioChange}
              >
                <SelectTrigger className="rounded-xl border-[var(--ui-stroke)] h-10">
                  <SelectValue placeholder="Selecione um locatário" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {locatariosDisponiveis.map(locatario => (
                    <SelectItem key={locatario.id} value={locatario.nome} className="rounded-lg">
                      {locatario.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm font-medium text-[var(--ui-text)]">{dados.locatario.nome}</p>
            )}
          </div>

          {/* Imóvel - Read only */}
          <div className="space-y-1">
            <Label className="text-xs text-[var(--ui-text-subtle)]">Imóvel</Label>
            <p className="text-sm text-[var(--ui-text)]">{dados.imovel.tipo} | {dados.imovel.endereco}</p>
          </div>

          {/* Competência */}
          <div className="space-y-1">
            <Label className="text-xs text-[var(--ui-text-subtle)]">Competência</Label>
            {isEditing ? (
              <Input
                value={editData.competencia}
                onChange={(e) => setEditData(prev => ({ ...prev, competencia: e.target.value }))}
                placeholder="Ex: Dezembro/2024"
                className="rounded-xl border-[var(--ui-stroke)] h-10"
              />
            ) : (
              <p className="text-sm font-medium text-[var(--ui-text)]">{dados.competencia}</p>
            )}
          </div>

          {/* Data de emissão */}
          <div className="space-y-1">
            <Label className="text-xs text-[var(--ui-text-subtle)]">Data de emissão</Label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl border-[var(--ui-stroke)] h-10",
                      !emissaoDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {emissaoDate ? format(emissaoDate, "dd/MM/yyyy") : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={emissaoDate}
                    onSelect={setEmissaoDate}
                    locale={ptBR}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <p className="text-sm text-[var(--ui-text)]">{dados.dataEmissao}</p>
            )}
          </div>

          {/* Vencimento */}
          <div className="space-y-1">
            <Label className="text-xs text-[var(--ui-text-subtle)]">Vencimento</Label>
            {isEditing ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl border-[var(--ui-stroke)] h-10",
                      !vencimentoDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vencimentoDate ? format(vencimentoDate, "dd/MM/yyyy") : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar
                    mode="single"
                    selected={vencimentoDate}
                    onSelect={setVencimentoDate}
                    locale={ptBR}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <p className="text-sm font-medium text-[var(--ui-text)]">{dados.dataVencimento}</p>
            )}
          </div>

          {/* Método de pagamento */}
          <div className="space-y-1">
            <Label className="text-xs text-[var(--ui-text-subtle)]">Método de pagamento</Label>
            {isEditing ? (
              <Select
                value={editData.metodoPagamento}
                onValueChange={(value) => setEditData(prev => ({ ...prev, metodoPagamento: value }))}
              >
                <SelectTrigger className="rounded-xl border-[var(--ui-stroke)] h-10">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {metodoPagamentoOptions.map(option => (
                    <SelectItem key={option.value} value={option.label} className="rounded-lg">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-[var(--ui-text)]">{dados.metodoPagamento}</p>
            )}
          </div>
        </div>

        {/* Metadados section */}
        <div className="pt-4 mt-4 border-t border-[var(--ui-stroke)]">
          <p className="text-xs font-medium text-[var(--ui-text-subtle)] mb-3">Metadados</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-[var(--ui-text-subtle)]">Status de conciliação</Label>
              {isEditing ? (
                <Select
                  value={editData.statusConciliacao || 'nao_enviado'}
                  onValueChange={(value) => setEditData(prev => ({ ...prev, statusConciliacao: value }))}
                >
                  <SelectTrigger className="rounded-xl border-[var(--ui-stroke)] h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {statusConciliacaoOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="rounded-lg">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-[var(--ui-text)]">
                  {statusConciliacaoOptions.find(o => o.value === dados.statusConciliacao)?.label || 'Não enviado ao banco'}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-[var(--ui-text-subtle)]">Responsável pela última alteração</Label>
              <p className="text-sm text-[var(--ui-text)]">{dados.responsavelAlteracao || 'Sistema'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-[var(--ui-text-subtle)]">Data da última alteração</Label>
              <p className="text-sm text-[var(--ui-text)]">{dados.dataAlteracao || '-'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaturaDadosGeraisCard;
