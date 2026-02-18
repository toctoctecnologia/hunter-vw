import { useQuery } from '@tanstack/react-query';

import { ModalProps } from '@/shared/types';

import { getProfiles } from '@/features/dashboard/access-control/api/profile';

import { UserForm } from '@/features/dashboard/access-control/components/form/user-form';

import { Loading } from '@/shared/components/loading';
import { Modal } from '@/shared/components/ui/modal';

interface ProfileModalProps extends Omit<ModalProps, 'title' | 'description'> {
  open: boolean;
  onClose: () => void;
}

export function NewUserModal({ open, onClose }: ProfileModalProps) {
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: () => getProfiles(),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo Usuário"
      description="Preencha os dados para criar um novo usuário"
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      ) : (
        <UserForm profiles={profiles} onSuccess={onClose} />
      )}
    </Modal>
  );
}
