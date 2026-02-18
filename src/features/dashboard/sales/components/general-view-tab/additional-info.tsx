import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';

import { AdditionalInfoModal } from '@/features/dashboard/sales/components/modal/additional-info-modal';
import { getAdditionalInfo, newAdditionalInfo } from '@/features/dashboard/sales/api/additional-info';
import { Button } from '@/shared/components/ui/button';
import { Loading } from '@/shared/components/loading';

interface AdditionalInfoProps {
  leadUuid: string;
}

export function AdditionalInfo({ leadUuid }: AdditionalInfoProps) {
  const queryClient = useQueryClient();

  const [description, setDescription] = useState('');
  const [isAdditionalInfoModalOpen, setIsAdditionalInfoModalOpen] = useState(false);

  const { data: additionalInfoList = [], isLoading: isLoadingAdditionalInfo } = useQuery({
    queryKey: ['lead-additional-info-list', leadUuid],
    queryFn: () => getAdditionalInfo(leadUuid),
    enabled: !!leadUuid,
  });

  const newAdditionalInfoMutation = useMutation({
    mutationFn: () => newAdditionalInfo(leadUuid, description),
    onSuccess: () => {
      toast.success('Informação adicional adicionada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['lead-additional-info-list', leadUuid] });
      setDescription('');
    },
  });

  if (isLoadingAdditionalInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
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
      <AdditionalInfoModal
        additionalInfoList={additionalInfoList}
        open={isAdditionalInfoModalOpen}
        onClose={() => setIsAdditionalInfoModalOpen(false)}
      />

      <Card>
        <CardHeader>
          <CardTitle>Informações Adicionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold opacity-60 mb-2">Adicionar nova informação</p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite qualquer informação relevante..."
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => newAdditionalInfoMutation.mutate()}
              disabled={!description.trim() || newAdditionalInfoMutation.isPending}
              isLoading={newAdditionalInfoMutation.isPending}
              className="flex-1"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>

            <Button variant="outline" className="flex-1" size="sm" onClick={() => setIsAdditionalInfoModalOpen(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver ({additionalInfoList.length})
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
