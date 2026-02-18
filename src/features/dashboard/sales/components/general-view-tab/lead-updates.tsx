import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { getLeadUpdates, newLeadUpdate } from '@/features/dashboard/sales/api/lead-updates';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';

import { LeadUpdatesModal } from '@/features/dashboard/sales/components/modal/lead-updates-modal';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';

interface LeadUpdatesProps {
  leadUuid: string;
}

export function LeadUpdates({ leadUuid }: LeadUpdatesProps) {
  const queryClient = useQueryClient();

  const [description, setDescription] = useState('');
  const [isLeadUpdatesModalOpen, setIsLeadUpdatesModalOpen] = useState(false);

  const { data: leadUpdates = [], isLoading: isLoadingLeadUpdates } = useQuery({
    queryKey: ['lead-updates-list', leadUuid],
    queryFn: () => getLeadUpdates(leadUuid),
    enabled: !!leadUuid,
  });

  const newLeadUpdateMutation = useMutation({
    mutationFn: () => newLeadUpdate(leadUuid, description),
    onSuccess: () => {
      toast.success('Atualização do lead adicionada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['lead-updates-list', leadUuid] });
      setDescription('');
    },
  });

  if (isLoadingLeadUpdates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atualizações do Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loading />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <LeadUpdatesModal
        open={isLeadUpdatesModalOpen}
        onClose={() => setIsLeadUpdatesModalOpen(false)}
        leadUpdates={leadUpdates}
        leadUuid={leadUuid}
      />

      <Card>
        <CardHeader>
          <CardTitle>Atualizações do Lead</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold opacity-60 mb-2">Adicionar nova atualização</p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Registre uma atualização sobre o lead..."
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => newLeadUpdateMutation.mutate()}
              disabled={!description.trim() || newLeadUpdateMutation.isPending}
              isLoading={newLeadUpdateMutation.isPending}
              className="flex-1"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>

            <Button variant="outline" className="flex-1" size="sm" onClick={() => setIsLeadUpdatesModalOpen(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver ({leadUpdates.length})
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
