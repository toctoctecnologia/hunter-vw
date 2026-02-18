'use client';
import React, { useState } from 'react';
import { Eye } from 'lucide-react';

import { Client } from '@/shared/types';

import { ClientDetailsModal } from '@/features/sadm-dashboard/access-control/components/modal/client-details-modal';
import { Button } from '@/shared/components/ui/button';

interface CellActionProps {
  data: Client;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <ClientDetailsModal open={isModalOpen} onClose={() => setIsModalOpen(false)} client={data} />

      <Button size="sm" variant="ghost" onClick={() => setIsModalOpen(true)}>
        <Eye className="size-4" />
      </Button>
    </>
  );
};
