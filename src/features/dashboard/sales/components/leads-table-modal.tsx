'use client';

import { useRouter } from 'next/navigation';
import { Eye, Phone, Mail, User, Users2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { getLeads } from '@/features/dashboard/sales/api/lead';

import { normalizePhoneNumber } from '@/shared/lib/masks';
import { funnelStageLabels } from '@/shared/lib/utils';
import { LeadFunnelStages } from '@/shared/types';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { NoContentCard } from '@/shared/components/no-content-card';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';

interface LeadsTableModalProps {
  open: boolean;
  onClose: () => void;
  funnelStep: LeadFunnelStages;
  stageLabel: string;
}

export function LeadsTableModal({ open, onClose, funnelStep, stageLabel }: LeadsTableModalProps) {
  const router = useRouter();

  const pagination = { pageIndex: 0, pageSize: 999 };
  const { data: leadsData = { content: [] }, isLoading } = useQuery({
    queryKey: ['leads', 'funnel-step', funnelStep],
    queryFn: () => getLeads({ filters: { funnelStep }, pagination }),
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[95vw] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Leads - {stageLabel || (funnelStep && funnelStageLabels[funnelStep])}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {leadsData.content.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone Principal</TableHead>
                        <TableHead>Telefone Secundário</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Captador</TableHead>
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leadsData.content.map((lead) => (
                        <TableRow key={lead.uuid} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{lead.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{normalizePhoneNumber(lead.phone1)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{lead.phone2 ? normalizePhoneNumber(lead.phone2) : '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[200px]">{lead.email || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{lead.catcher?.name || '-'}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/sales/${lead.uuid}/details`);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <NoContentCard title="Nenhum lead encontrado para esta etapa." icon={Users2} />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
