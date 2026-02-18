import { useState } from 'react';
import { PenLine } from 'lucide-react';

import { PlanModal } from '@/features/sadm-dashboard/access-control/components/modal/plan-modal';
import { TypographySmall } from '@/shared/components/ui/typography';
import { Button } from '@/shared/components/ui/button';

import { Plan } from '@/shared/types';

interface PlanItemProps {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

export function PlanItem({ plan, onSelect }: PlanItemProps) {
  const [showPlanModal, setShowPlanModal] = useState(false);

  return (
    <>
      <PlanModal open={showPlanModal} plan={plan} onClose={() => setShowPlanModal(false)} />

      <div className="flex items-center px-4">
        <button
          className="flex-1 text-left p-3 rounded-lg flex items-center gap-3 transition-colors"
          onClick={() => onSelect(plan)}
        >
          <div>
            <TypographySmall>{plan.name}</TypographySmall>
          </div>
        </button>

        <Button size="sm" variant="outline" onClick={() => setShowPlanModal(true)}>
          <PenLine className="size-3" />
        </Button>
      </div>
    </>
  );
}
