import React, { useMemo, useState } from 'react';
import { Send, Paperclip, Edit3, Trash2, MessageSquare, User, Bot, History, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImovelUpdate } from '@/types/imovel';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UpdatesTimelineSectionProps {
  updates: ImovelUpdate[];
  onAddUpdate: (update: Omit<ImovelUpdate, 'id' | 'createdAt'>) => void;
  onEditUpdate?: (id: string, update: Partial<ImovelUpdate>) => void;
  onDeleteUpdate?: (id: string) => void;
}

export function UpdatesTimelineSection({ 
  updates, 
  onAddUpdate, 
  onEditUpdate, 
  onDeleteUpdate 
}: UpdatesTimelineSectionProps) {
  const [newUpdate, setNewUpdate] = useState('');
  const [selectedTag, setSelectedTag] = useState<ImovelUpdate['tag']>('azul');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedUser, setSelectedUser] = useState('todos');
  const [selectedType, setSelectedType] = useState('todos');
  const [selectedPeriod, setSelectedPeriod] = useState('todos');
  const [searchDescription, setSearchDescription] = useState('');
  const [hideBotUser, setHideBotUser] = useState(false);

  const historyItems = [
    {
      id: 'h1',
      date: new Date('2025-12-01T09:14:00'),
      tipo: 'Leitura',
      responsavel: 'IMOVIEW ROBÔ',
      descricao: 'Indicadores do imóvel visualizado pelo vendedor, por meio do painel de performance.',
    },
    {
      id: 'h2',
      date: new Date('2025-12-01T09:14:00'),
      tipo: 'Integração',
      responsavel: 'IMOVIEW ROBÔ',
      descricao: "Webhook 'Padrão' enviado com sucesso",
    },
    {
      id: 'h3',
      date: new Date('2025-12-01T09:14:00'),
      tipo: 'Integração',
      responsavel: 'IMOVIEW ROBÔ',
      descricao: "Webhook 'Imóvel n8n' enviado com sucesso",
    },
    {
      id: 'h4',
      date: new Date('2025-12-01T09:14:00'),
      tipo: 'Integração',
      responsavel: 'IMOVIEW ROBÔ',
      descricao:
        "Webhook 'gemini natal', tentativa 1, NÃO enviado: {\"code\":404,\"message\":\"The requested webhook is not registered.\"}",
    },
    {
      id: 'h5',
      date: new Date('2025-12-01T09:13:18'),
      tipo: 'Validação de alteração',
      responsavel: 'Eliseu dos Santos',
      descricao: "ÚLTIMA VALIDAÇÃO alterado de '04/11/2025 11:02:44' para '01/12/2025 09:13:18'",
    },
    {
      id: 'h6',
      date: new Date('2025-12-01T09:11:00'),
      tipo: 'Visualização',
      responsavel: 'Eliseu dos Santos',
      descricao: 'Proprietários visualizados',
    },
    {
      id: 'h7',
      date: new Date('2025-11-24T12:13:00'),
      tipo: 'Integração',
      responsavel: 'IMOVIEW ROBÔ',
      descricao:
        "Webhook 'gemini natal', tentativa 5, NÃO enviado: {\"code\":404,\"message\":\"The requested webhook is not registered.\"}",
    },
    {
      id: 'h8',
      date: new Date('2025-11-24T12:07:00'),
      tipo: 'Integração',
      responsavel: 'IMOVIEW ROBÔ',
      descricao:
        "Webhook 'gemini natal', tentativa 4, NÃO enviado: {\"code\":404,\"message\":\"The requested webhook is not registered.\"}",
    },
  ];

  const tagOptions = [
    { value: 'verde', label: 'OK', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'amarelo', label: 'Atenção', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'vermelho', label: 'Crítico', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'azul', label: 'Info', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  ] as const;

  const handleSubmit = () => {
    if (!newUpdate.trim()) return;

    onAddUpdate({
      texto: newUpdate.trim(),
      tag: selectedTag,
      author: { id: 'current-user', name: 'Usuário Atual' },
    });

    setNewUpdate('');
    setSelectedTag('azul');
  };

  const handleEdit = (update: ImovelUpdate) => {
    setEditingId(update.id);
    setEditText(update.texto);
  };

  const handleSaveEdit = () => {
    if (!editingId || !onEditUpdate) return;
    
    onEditUpdate(editingId, { texto: editText.trim() });
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getTagConfig = (tag: ImovelUpdate['tag']) => {
    return tagOptions.find(opt => opt.value === tag) || tagOptions[3];
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatHistoryDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  const historyUsers = useMemo(() => {
    const unique = new Set(historyItems.map(item => item.responsavel));
    return ['todos', ...Array.from(unique)];
  }, [historyItems]);

  const historyTypes = useMemo(() => {
    const unique = new Set(historyItems.map(item => item.tipo));
    return ['todos', ...Array.from(unique)];
  }, [historyItems]);

  const filteredHistory = useMemo(() => {
    const periodMap: Record<string, number | null> = {
      todos: null,
      '7dias': 7,
      '30dias': 30,
      '90dias': 90,
    };
    const maxDays = periodMap[selectedPeriod];
    const now = new Date('2025-12-01T12:00:00');

    return historyItems.filter(item => {
      if (hideBotUser && item.responsavel.toLowerCase().includes('robô')) {
        return false;
      }
      if (selectedUser !== 'todos' && item.responsavel !== selectedUser) {
        return false;
      }
      if (selectedType !== 'todos' && item.tipo !== selectedType) {
        return false;
      }
      if (maxDays) {
        const diffDays = (now.getTime() - item.date.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > maxDays) {
          return false;
        }
      }
      if (searchDescription.trim()) {
        const search = searchDescription.toLowerCase();
        if (!item.descricao.toLowerCase().includes(search)) {
          return false;
        }
      }
      return true;
    });
  }, [hideBotUser, historyItems, searchDescription, selectedPeriod, selectedType, selectedUser]);

  const handleClearFilters = () => {
    setSelectedUser('todos');
    setSelectedType('todos');
    setSelectedPeriod('todos');
    setSearchDescription('');
    setHideBotUser(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          Atualizações e histórico
        </h3>
        <p className="text-sm text-gray-600 mt-1">Acompanhe registros de atualização e trilha de eventos do imóvel</p>
      </div>

      <Tabs defaultValue="atualizacoes" className="space-y-6">
        <TabsList className="bg-gray-100/80 p-1 rounded-xl w-fit">
          <TabsTrigger
            value="atualizacoes"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Atualizações
          </TabsTrigger>
          <TabsTrigger
            value="historico"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="atualizacoes" className="space-y-6">
          {/* Composer */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
            <Textarea
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              placeholder="Descreva a atualização..."
              className="border-gray-200 focus:border-orange-500 rounded-xl resize-none"
              rows={3}
            />

            {/* Tag Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {tagOptions.map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => setSelectedTag(tag.value)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                      selectedTag === tag.value
                        ? tag.color
                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-gray-600"
                >
                  <Paperclip className="w-4 h-4 mr-1" />
                  Anexos
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!newUpdate.trim()}
                  className="bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {updates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma atualização registrada ainda</p>
              </div>
            ) : (
              updates.map((update) => (
                <div key={update.id} className="border border-gray-200 rounded-xl p-4">
                  {editingId === update.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border-gray-200 focus:border-orange-500 rounded-lg"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveEdit}
                          size="sm"
                          className="bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                          Salvar
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {update.author ? (
                              <User className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Bot className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {update.author?.name || 'Sistema'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(update.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getTagConfig(update.tag).color} font-medium`}>
                            {getTagConfig(update.tag).label}
                          </Badge>
                          {onEditUpdate && (
                            <Button
                              onClick={() => handleEdit(update)}
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          )}
                          {onDeleteUpdate && (
                            <Button
                              onClick={() => onDeleteUpdate(update.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {update.texto}
                      </p>

                      {update.anexos && update.anexos.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">Anexos:</p>
                          <div className="flex flex-wrap gap-2">
                            {update.anexos.map((anexo) => (
                              <a
                                key={anexo.id}
                                href={anexo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-orange-600 hover:text-orange-700 underline"
                              >
                                {anexo.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2 text-gray-900">
                <History className="w-5 h-5 text-gray-600" />
                <h4 className="text-base font-semibold">Histórico de auditoria</h4>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Filter className="w-4 h-4" />
                {filteredHistory.length} eventos encontrados
              </div>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="grid gap-4 lg:grid-cols-[repeat(5,minmax(0,1fr))]">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">Usuário</label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {historyUsers.map(user => (
                        <SelectItem key={user} value={user}>
                          {user === 'todos' ? 'Todos' : user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">Tipo</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      {historyTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'todos' ? 'Todos' : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">Período</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="rounded-xl border-gray-200">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                      <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                      <SelectItem value="90dias">Últimos 90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">Descrição</label>
                  <Input
                    value={searchDescription}
                    onChange={(event) => setSearchDescription(event.target.value)}
                    placeholder="Digite uma parte da descrição"
                    className="rounded-xl border-gray-200"
                  />
                </div>

                <div className="flex flex-col justify-between gap-2">
                  <label className="text-xs font-medium text-gray-500">Não exibir usuário robô</label>
                  <div className="flex items-center gap-2">
                    <Switch checked={hideBotUser} onCheckedChange={setHideBotUser} />
                    <span className="text-xs text-gray-500">Ocultar robôs</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-gray-200 text-gray-600"
                  onClick={handleClearFilters}
                >
                  Limpar
                </Button>
                <Button
                  type="button"
                  className="rounded-xl bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Pesquisar
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-500">Data Hora</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Tipo</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Responsável</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-gray-500 py-8">
                        Nenhum evento encontrado com os filtros atuais.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHistory.map(item => (
                      <TableRow key={item.id} className="hover:bg-gray-50/70">
                        <TableCell className="text-sm text-gray-700 whitespace-nowrap">
                          {formatHistoryDate(item.date)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 whitespace-nowrap">
                          {item.tipo}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 whitespace-nowrap">
                          {item.responsavel}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 leading-relaxed">
                          {item.descricao}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
