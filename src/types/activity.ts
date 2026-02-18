export interface Activity {
  leadId: string;
  createdAt: string;
  type: string;
  createdByUserId: string;
  fromStage: string;
  toStage: string;
}

export interface StageMove {
  leadId: string;
  createdAt: string;
  type: string;
  createdByUserId: string;
  fromStage: string;
  toStage: string;
}
