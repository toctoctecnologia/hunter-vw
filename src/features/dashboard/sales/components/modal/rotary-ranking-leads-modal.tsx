'use client';

import { useRouter } from '@/shims/next-navigation';
import { Eye, Phone, Tag, MapPin } from 'lucide-react';

import { leadFunnelStepToLabel, LeadOriginTypeToLabel } from '@/shared/lib/utils';
import { normalizePhoneNumber } from '@/shared/lib/masks';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { NoContentCard } from '@/shared/components/no-content-card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

interface Lead {
  uuid: string;
  name: string;
  phone1: string;
  funnelStep: string;
  originType: string;
  tag: 'roletão' | 'próximo da fila';
}

interface RotaryRankingLeadsModalProps {
  open: boolean;
  onClose: () => void;
  brokerName: string;
  leads: Lead[];
  isLoading?: boolean;
}

export function RotaryRankingLeadsModal({ open, onClose, brokerName, leads, isLoading }: RotaryRankingLeadsModalProps) {
  const router = useRouter();

  const handleViewLead = (leadUuid: string) => {
    router.push(`/dashboard/leads/${leadUuid}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[95vw] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Leads de {brokerName}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {leads.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tag</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Etapa do Funil</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.uuid} className="hover:bg-muted/50">
                          <TableCell>
                            <span className="font-medium">{lead.name}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={lead.tag === 'roletão' ? 'default' : 'secondary'}
                              className="flex items-center gap-1 w-fit"
                            >
                              <Tag className="h-3 w-3" />
                              {lead.tag}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{LeadOriginTypeToLabel(lead.originType)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{normalizePhoneNumber(lead.phone1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{leadFunnelStepToLabel(lead.funnelStep)}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewLead(lead.uuid)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Visualizar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <NoContentCard title="Nenhum lead encontrado" />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
