import { PlanFormData } from '@/features/sadm-dashboard/access-control/components/form/plan-form/schema';

interface SavePlan extends PlanFormData {
  uuid: string;
}

export type { SavePlan };
