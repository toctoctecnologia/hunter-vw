'use client';
import React from 'react';
import { useRouter } from '@/shims/next-navigation';
import { ExternalLink } from 'lucide-react';

import { LeadDetail } from '@/shared/types';

import { Button } from '@/shared/components/ui/button';

interface CellActionProps {
  data: LeadDetail;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  return (
    <div className="space-x-2">
      <Button size="sm" variant="ghost" onClick={() => router.push(`/dashboard/sales/${data.uuid}/details`)}>
        <ExternalLink className="size-4" />
      </Button>
    </div>
  );
};
