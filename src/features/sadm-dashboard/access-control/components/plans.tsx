'use client';

import { Plan } from '@/shared/types';

import { PlanItem } from '@/features/sadm-dashboard/access-control/components/plan-item';

interface PlansProps {
  plans: Plan[];
  onSelectPlan?: (plan: Plan) => void;
}

export function Plans({ plans, onSelectPlan }: PlansProps) {
  return (
    <div className="flex flex-col h-full mt-4">
      {plans.map((plan) => (
        <PlanItem key={plan.uuid} plan={plan} onSelect={() => onSelectPlan?.(plan)} />
      ))}
    </div>
  );
}
