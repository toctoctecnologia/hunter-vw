'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

import { downloadReport } from '@/features/dashboard/manage-reports/api/report';

import { Button } from '@/shared/components/ui/button';
import { ExportHistoryData } from '@/shared/types';

interface CellActionProps {
  data: ExportHistoryData;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (jobId: string) => downloadReport(jobId),
    onSuccess: (downloadUrl: string) => {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = '';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });

  return (
    <Button size="sm" onClick={() => mutate(data.id)} isLoading={isPending}>
      <Download className="size-4" />
    </Button>
  );
};
