import { Profile } from '@/features/dashboard/access-control/types';
import { ModalProps, Permission } from '@/shared/types';

import { ProfileForm } from '@/features/dashboard/access-control/components/form/profile-form';
import { Modal } from '@/shared/components/ui/modal';

interface ProfileModalProps extends Omit<ModalProps, 'title' | 'description'> {
  open: boolean;
  onClose: () => void;
  editingProfile?: Profile | null;
  availablePermissions: Permission[];
}

export function ProfileModal({ open, onClose, editingProfile, availablePermissions }: ProfileModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={editingProfile ? 'Editar Perfil de Acesso' : 'Novo Perfil de Acesso'}>
      <ProfileForm editingProfile={editingProfile} availablePermissions={availablePermissions} onSuccess={onClose} />
    </Modal>
  );
}
