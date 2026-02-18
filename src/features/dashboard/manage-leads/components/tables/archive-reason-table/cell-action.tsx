'use client';
import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';

import { ArchiveReason } from '@/shared/types';

import { SaveArchiveReasonModal } from '@/features/dashboard/manage-leads/components/modal/save-archive-reason-modal';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { hasFeature } from '@/shared/lib/permissions';

interface CellActionProps {
  data: ArchiveReason;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <SaveArchiveReasonModal open={isModalOpen} onClose={() => setIsModalOpen(false)} archiveReason={data} />

      {hasFeature(user?.userInfo.profile.permissions, '2401') && (
        <div className="space-x-2">
          <Button size="sm" variant="ghost" onClick={() => setIsModalOpen(true)}>
            <Edit3 className="size-4" />
          </Button>
        </div>
      )}
    </>
  );
};
