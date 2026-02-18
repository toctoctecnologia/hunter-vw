'use client';

import { useState } from 'react';
import { Calendar, Clock, User, FileText, Phone, Download, Eye, Share, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AuditEvent } from '../types';

interface Props {
  data: AuditEvent[] | null;
  loading: boolean;
  error: string | null;
}

const eventTypeConfig = {
  login: { icon: User, label: 'Login', color: 'bg-blue-100 text-blue-700' },
  view_property: { icon: Eye, label: 'Visualizou imóvel', color: 'bg-green-100 text-green-700' },
  view_owner_phone: { icon: Phone, label: 'Visualizou telefone', color: 'bg-orange-100 text-orange-700' },
  download_photos: { icon: Download, label: 'Baixou fotos', color: 'bg-purple-100 text-purple-700' },
  lead_update: { icon: FileText, label: 'Atualizou lead', color: 'bg-gray-100 text-gray-700' },
  schedule_visit: { icon: Calendar, label: 'Agendou visita', color: 'bg-cyan-100 text-cyan-700' },
  upload_photos: { icon: Upload, label: 'Enviou fotos', color: 'bg-pink-100 text-pink-700' },
  share_listing: { icon: Share, label: 'Compartilhou anúncio', color: 'bg-yellow-100 text-yellow-700' },
  export_csv: { icon: Download, label: 'Exportou dados', color: 'bg-indigo-100 text-indigo-700' },
};

export default function UserHistoryContent({ data, loading, error }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">{error}</div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Nenhum dado de histórico disponível</div>
      </Card>
    );
  }

  const filteredData = data.filter(event => {
    const matchesSearch = event.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Pesquisar no histórico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(eventTypeConfig).map(([type, config]) => (
                <SelectItem key={type} value={type}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Histórico de Atividades</h3>
        
        {paginatedData.length === 0 ? (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              Nenhuma atividade encontrada com os filtros aplicados
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {paginatedData.map((event) => {
              const config = eventTypeConfig[event.type] || eventTypeConfig.login;
              const Icon = config.icon;
              
              return (
                <Card key={event.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${config.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{config.label}</span>
                        {event.type === 'view_owner_phone' && (
                          <Badge variant="destructive" className="text-xs">
                            Dado sensível
                          </Badge>
                        )}
                      </div>
                      
                      {event.label && (
                        <p className="text-sm text-muted-foreground mb-2">{event.label}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(event.ts), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </div>
                        
                        {event.ip && (
                          <div className="flex items-center gap-1">
                            <span>IP:</span>
                            <span className="font-mono">
                              {event.ip.split('.').map((part, i) => i < 2 ? part : 'xxx').join('.')}
                            </span>
                          </div>
                        )}
                        
                        {event.targetId && (
                          <div className="flex items-center gap-1">
                            <span>ID:</span>
                            <span className="font-mono">{event.targetId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} registros
            </p>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}