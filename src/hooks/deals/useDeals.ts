import { create } from 'zustand';
import type { Proposal, Deal, CommissionSplit } from '@/types/deal';

interface DealsState {
  proposals: Proposal[];
  deals: Deal[];
  sendProposal: (data: Omit<Proposal, 'id' | 'status'>) => Promise<Proposal>;
  acceptProposal: (id: string) => Promise<void>;
  rejectProposal: (id: string) => Promise<void>;
  closeDeal: (
    proposalId: string,
    commission?: CommissionSplit[],
  ) => Promise<Deal>;
}

export const useDeals = create<DealsState>((set, get) => ({
  proposals: [],
  deals: [],
  sendProposal: async data => {
    const proposal: Proposal = {
      ...data,
      id: crypto.randomUUID(),
      status: 'sent',
    };
    set(state => ({ proposals: [...state.proposals, proposal] }));
    try {
      await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposal),
      });
      await fetch(`/api/leads/${proposal.leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'proposal_sent',
          propertyId: proposal.propertyId,
          value: proposal.value,
        }),
      });
    } catch {
      /* ignore */
    }
    return proposal;
  },
  acceptProposal: async id => {
    const proposal = get().proposals.find(p => p.id === id);
    set(state => ({
      proposals: state.proposals.map(p =>
        p.id === id ? { ...p, status: 'accepted' } : p,
      ),
    }));
    try {
      await fetch(`/api/proposals/${id}/accept`, { method: 'POST' });
      if (proposal) {
        await fetch(`/api/leads/${proposal.leadId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'proposal_accepted',
            propertyId: proposal.propertyId,
            value: proposal.value,
          }),
        });
      }
    } catch {
      /* ignore */
    }
  },
  rejectProposal: async id => {
    const proposal = get().proposals.find(p => p.id === id);
    set(state => ({
      proposals: state.proposals.map(p =>
        p.id === id ? { ...p, status: 'rejected' } : p,
      ),
    }));
    try {
      await fetch(`/api/proposals/${id}/reject`, { method: 'POST' });
      if (proposal) {
        await fetch(`/api/leads/${proposal.leadId}/activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'proposal_rejected',
            propertyId: proposal.propertyId,
            value: proposal.value,
          }),
        });
      }
    } catch {
      /* ignore */
    }
  },
  closeDeal: async (proposalId, commission = []) => {
    const proposal = get().proposals.find(p => p.id === proposalId);
    if (!proposal) throw new Error('Proposal not found');
    const now = new Date().toISOString();
    const deal: Deal = {
      id: crypto.randomUUID(),
      proposal: { ...proposal, status: 'accepted' },
      commission,
      createdAt: now,
      closedAt: now,
    };
    set(state => ({
      proposals: state.proposals.filter(p => p.id !== proposalId),
      deals: [...state.deals, deal],
    }));
    try {
      await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal),
      });
      await fetch(`/api/leads/${proposal.leadId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'deal_closed',
          dealId: deal.id,
          value: proposal.value,
          commission,
        }),
      });
    } catch {
      /* ignore */
    }
    return deal;
  },
}));

export default useDeals;
