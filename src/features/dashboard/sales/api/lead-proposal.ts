import { api } from '@/shared/lib/api';

import { LeadBankItem, LeadProposalItem, LeadProposalStatus } from '@/shared/types';

import { MakeProposalFormData } from '@/features/dashboard/sales/components/form/make-proposal-schema';

export async function getLeadProposal(leadUuid: string) {
  const { data } = await api.get<LeadProposalItem>(`dashboard/lead/${leadUuid}/proposal`);
  return data;
}

export async function newLeadProposal(leadUuid: string, formData: MakeProposalFormData) {
  await api.post(`dashboard/lead/${leadUuid}/proposal`, formData);
}

export async function updateLeadProposalStatus(leadUuid: string, proposalStatus: LeadProposalStatus) {
  await api.patch(`dashboard/lead/${leadUuid}/proposal/${proposalStatus}`);
}

export async function getLeadBankOptions() {
  const { data } = await api.get<LeadBankItem[]>(`dashboard/lead/bank/active`);
  return data;
}
