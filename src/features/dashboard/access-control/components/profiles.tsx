'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';

import { hasFeature } from '@/shared/lib/permissions';
import { useAuth } from '@/shared/hooks/use-auth';

import { Profile } from '@/features/dashboard/access-control/types';
import { Permission } from '@/shared/types';

import { ProfileModal } from '@/features/dashboard/access-control/components/modal/profile-modal';
import { ProfileItem } from '@/features/dashboard/access-control/components/profile-item';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Button } from '@/shared/components/ui/button';

interface ProfilesProps {
  data: Profile[];
  availablePermissions: Permission[];
}

export function Profiles({ data, availablePermissions }: ProfilesProps) {
  const { user } = useAuth();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const handleOpenModal = (profile?: Profile) => {
    if (!hasFeature(user?.userInfo.profile.permissions, '1701')) return;

    if (profile) {
      setEditingProfile(profile);
    } else {
      setEditingProfile(null);
    }
    setShowProfileModal(true);
  };

  const handleCloseModal = () => {
    setShowProfileModal(false);
    setEditingProfile(null);
  };

  return (
    <>
      <ProfileModal
        open={showProfileModal}
        onClose={handleCloseModal}
        editingProfile={editingProfile}
        availablePermissions={availablePermissions}
      />

      <div className="space-y-2 flex flex-col h-full">
        <ScrollArea className="h-[65vh] px-2 sm:px-4">
          {data.map((item) => (
            <ProfileItem key={item.code} dataItem={item} onEdit={handleOpenModal} />
          ))}
        </ScrollArea>

        {hasFeature(user?.userInfo.profile.permissions, '1701') && (
          <div className="px-2 sm:px-4 mt-auto">
            <Button className="w-full" onClick={() => handleOpenModal()}>
              <Plus className="size-4" />
              Adicionar perfil
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
