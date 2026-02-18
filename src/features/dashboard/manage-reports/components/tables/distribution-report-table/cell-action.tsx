'use client';
import React, { useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';

import { PropertyBuilder } from '@/shared/types';

import { SaveBuilderModal } from '@/features/dashboard/properties/components/modal/save-builder-modal';
import { Button } from '@/shared/components/ui/button';

interface CellActionProps {
  data: PropertyBuilder;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="space-x-2">
        <Button size="sm" variant="ghost" onClick={() => setIsModalOpen(true)}>
          <Edit3 className="size-4" />
        </Button>

        <Button size="sm" variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 className="size-4" />
        </Button>
      </div>
    </>
  );
};
