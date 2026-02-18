import React, { useEffect, useState } from 'react';
import { debugLog } from '@/utils/debug';
import { ChevronLeft, Search, Archive, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ARCHIVE_REASONS, type ArchiveReason } from '@/types/lead-archive';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useLeadsStore } from '@/hooks/vendas';
import type { Lead } from '@/types/lead';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArchiveLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchiveLeadModal = ({ isOpen, onClose }: ArchiveLeadModalProps) => {
  const [query, setQuery] = useState('');
  const [selectedReason, setSelectedReason] = useState<ArchiveReason | null>(null);
  const [discardDescription, setDiscardDescription] = useState('');
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { load } = useLeadsStore();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedReason(null);
      setDiscardDescription('');
      setIsDescriptionModalOpen(false);
    }
  }, [isOpen]);

  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const regex = new RegExp(escapeRegExp(normalize(query)), 'i');

  const filteredReasons = ARCHIVE_REASONS.filter((reason) =>
    regex.test(normalize(reason.label))
  );

  const handleArchive = async (description?: string) => {
    debugLog('Lead arquivado:', {
      reason: selectedReason?.code,
      label: selectedReason?.label,
      description
    });

    if (!selectedReason || !id) return;

    try {
      const res = await fetch(`/api/leads/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reasonCode: selectedReason.code,
          reasonLabel: selectedReason.label,
          reasonDescription: description?.trim() || undefined
        })
      });
      if (!res.ok) throw new Error('Failed to archive');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      await load();
      toast({ title: 'Lead arquivado' });
    } catch {
      try {
        const cached = localStorage.getItem('leads');
        if (cached) {
          const parsed = JSON.parse(cached) as Lead[];
          const leadId = Number(id);
          const updated = parsed.map((lead) =>
            lead.id === leadId
              ? {
                  ...lead,
                  status: 'archived',
                  archiveReason: selectedReason.label,
                  archiveReasonDescription: description?.trim() || undefined
                }
              : lead
          );
          localStorage.setItem('leads', JSON.stringify(updated));
          // TODO: persistir
        }
      } catch {
        // ignore
      }
      await load();
    }

    setDiscardDescription('');
    setIsDescriptionModalOpen(false);
    onClose();
  };

  const shouldRequestDescription = selectedReason?.code === 'ALUGADO';

  const handleConfirm = () => {
    if (shouldRequestDescription && !isDescriptionModalOpen) {
      setIsDescriptionModalOpen(true);
      return;
    }

    handleArchive(discardDescription);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="rounded-2xl w-[92vw] max-w-[720px] md:max-w-[760px] p-0 max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="sr-only">
            <DialogTitle>Arquivar lead</DialogTitle>
          </DialogHeader>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-100"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Archive className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">
                Arquivar lead
              </h2>
            </div>
            <div className="w-10" />
          </div>

          {/* Search Input */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                placeholder="Pesquisar um motivo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-500 pl-10 border border-neutral-200"
              />
            </div>
          </div>

          {/* Reasons */}
          <ScrollArea className="px-4 pb-4 h-[48vh] md:h-[56vh] overscroll-contain">
            <div className="space-y-3">
              {filteredReasons.map((reason) => {
                const selected = selectedReason?.code === reason.code;
                return (
                  <button
                    key={reason.code}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSelectedReason(reason)}
                    className={cn(
                      'w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left border transition-colors',
                      selected
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                    )}
                  >
                    <span className="font-medium text-base">{reason.label}</span>
                    {selected && <Check className="w-5 h-5 text-orange-600" />}
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="sticky bottom-0 p-4 bg-white border-t mt-auto">
            <Button
              onClick={handleConfirm}
              disabled={!selectedReason}
              className="w-full h-14 rounded-2xl bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDescriptionModalOpen}
        onOpenChange={(open) => setIsDescriptionModalOpen(open)}
      >
        <DialogContent className="rounded-2xl w-[92vw] max-w-[520px] p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-semibold text-neutral-900">
              Adicionar descrição do descarte?
            </DialogTitle>
            <p className="text-sm text-neutral-600">
              Você selecionou &quot;Alugado&quot;. Se quiser, descreva o descarte
              além do motivo escolhido.
            </p>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium text-neutral-700">
              Descrição do descarte (opcional)
            </label>
            <Textarea
              value={discardDescription}
              onChange={(event) => setDiscardDescription(event.target.value)}
              placeholder="Ex.: Cliente informou que já alugou outro imóvel."
              className="min-h-[120px] rounded-2xl border border-neutral-200 focus-visible:ring-orange-500"
            />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-neutral-200"
              onClick={() => {
                setDiscardDescription('');
                handleArchive();
              }}
            >
              Continuar sem descrição
            </Button>
            <Button
              type="button"
              className="rounded-2xl bg-orange-600 text-white hover:bg-orange-700"
              onClick={() => handleArchive(discardDescription)}
            >
              Salvar e arquivar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
