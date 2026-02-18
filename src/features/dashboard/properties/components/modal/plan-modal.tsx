import { Modal } from '@/shared/components/ui/modal';
import { ModalProps, Plan } from '@/shared/types';

import { PlanForm } from '@/features/sadm-dashboard/access-control/components/form/plan-form';

interface PlanModalProps extends Omit<ModalProps, 'title' | 'description'> {
  plan: Plan;
}

export function PlanModal({ open, onClose, plan }: PlanModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={plan.name} description={`Editando ${plan.name}`}>
      <PlanForm plan={plan} />
    </Modal>
  );
}
