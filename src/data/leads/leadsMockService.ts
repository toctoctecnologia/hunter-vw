import { nanoid } from 'nanoid';
import { Lead, LeadStatus, DateRangeKey } from './leadTypes';
import { parseCsv, generateCsv } from './csv';

const STORAGE_KEY = 'leads.v1';
const LAYOUT_KEY = 'leads.dashboard.layout';

const MOCK_OWNERS = [
  { id: 'alice', name: 'Alice Ribeiro' },
  { id: 'bob', name: 'Bob Martins' },
  { id: 'carol', name: 'Carol Dias' },
  { id: 'diego', name: 'Diego Nunes' }
];

function getRandomOwner() {
  return MOCK_OWNERS[Math.floor(Math.random() * MOCK_OWNERS.length)];
}

function readLeads(): Lead[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) as Lead[] : [];
}

function writeLeads(leads: Lead[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function seedIfEmpty(): void {
  if (readLeads().length) return;
  const statuses: LeadStatus[] = ['new', 'contacted', 'qualified', 'lost', 'won'];
  const sources = ['website', 'referral', 'phone', 'email', 'ads'];
  const total = 2000 + Math.floor(Math.random() * 1000);
  const leads: Lead[] = [];
  for (let i = 0; i < total; i++) {
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 365) * 86400000).toISOString();
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const owner = getRandomOwner();
    leads.push({
      id: nanoid(),
      name: `Lead ${i + 1}`,
      email: `lead${i + 1}@example.com`,
      phone: `+1-555-${(1000 + i).toString().padStart(4, '0')}`,
      ownerId: owner.id,
      ownerName: owner.name,
      status,
      source: sources[Math.floor(Math.random() * sources.length)],
      createdAt
    });
  }
  writeLeads(leads);
}

export interface ListFilters {
  search?: string;
  status?: LeadStatus;
  from?: string;
  to?: string;
}

export function list(filters: ListFilters = {}): Lead[] {
  const { search, status, from, to } = filters;
  let leads = readLeads();
  if (status) leads = leads.filter(l => l.status === status);
  if (from) {
    const fromDate = new Date(from);
    leads = leads.filter(l => new Date(l.createdAt) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    leads = leads.filter(l => new Date(l.createdAt) <= toDate);
  }
  if (search) {
    const q = search.toLowerCase();
    leads = leads.filter(
      l =>
        l.name.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.phone && l.phone.toLowerCase().includes(q))
    );
  }
  return leads;
}

export async function importCsv(file: File): Promise<number> {
  const text = await file.text();
  const records = parseCsv(text);
  const existing = readLeads();
  const newLeads: Lead[] = records.map(r => {
    const fallbackOwner = getRandomOwner();
    return {
      id: nanoid(),
      name: r.name || r.nome || '',
      email: r.email || '',
      phone: r.phone || r.telefone || '',
      ownerId: r.ownerId || r.owner || fallbackOwner.id,
      ownerName: r.ownerName || r.responsavel || fallbackOwner.name,
      status: (r.status as LeadStatus) || 'new',
      source: r.source || r.origem || '',
      createdAt: r.createdAt || new Date().toISOString()
    };
  });
  const all = existing.concat(newLeads);
  writeLeads(all);
  return newLeads.length;
}

export function exportCsv(filters: ListFilters = {}): void {
  const leads = list(filters);
  const csv = generateCsv(leads);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function stats(range: DateRangeKey): Record<LeadStatus, number> {
  let days = 0;
  switch (range) {
    case '7d':
      days = 7;
      break;
    case '30d':
      days = 30;
      break;
    case '90d':
      days = 90;
      break;
    case '365d':
      days = 365;
      break;
    default:
      days = 0;
  }
  const from = days ? new Date(Date.now() - days * 86400000).toISOString() : undefined;
  const leads = list({ from });
  const result: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
    won: 0
  };
  for (const lead of leads) {
    result[lead.status] = (result[lead.status] || 0) + 1;
  }
  return result;
}

export function getLayout<T = unknown>(): T | null {
  const raw = localStorage.getItem(LAYOUT_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function saveLayout(layout: unknown): void {
  localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
}

export function transferLeadOwner(
  leadId: string,
  newOwnerId: string,
  newOwnerName: string
): Lead | null {
  const leads = readLeads();
  const index = leads.findIndex(lead => lead.id === leadId);
  if (index === -1) return null;

  const updatedLead: Lead = {
    ...leads[index],
    ownerId: newOwnerId,
    ownerName: newOwnerName || 'Responsável'
  };

  leads[index] = updatedLead;
  writeLeads(leads);
  return updatedLead;
}
