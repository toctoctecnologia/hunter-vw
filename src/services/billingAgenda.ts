import { addDays, isAfter } from 'date-fns';
import type { Event } from '@/types/event';

export type BillingRuleStageType = 'before' | 'after' | 'due';

export interface BillingRuleStage {
  id: string;
  label: string;
  offsetDays: number;
  type: BillingRuleStageType;
  channel?: string;
  action?: string;
  responsible?: string;
  active: boolean;
}

export interface BillingRule {
  id: string;
  nome: string;
  ativo: boolean;
  escopo: 'carteira' | 'contrato';
}

export interface BillingContext {
  contractId: string;
  invoiceId: string;
  contractLabel?: string;
  invoiceLabel?: string;
}

export interface BillingTimelineItem {
  id: string;
  stageId: string;
  label: string;
  scheduledAt: string;
  status: 'pendente' | 'executado' | 'cancelado' | 'reagendado';
  channel: string;
  action: string;
  contractId: string;
  invoiceId: string;
  billingRuleId: string;
  logs: string[];
}

const STORAGE_KEY = 'hunter:billing:timeline';

const toKey = (contractId: string, invoiceId: string, stageId: string) =>
  `${contractId}:${invoiceId}:${stageId}`;

const readTimeline = (): BillingTimelineItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as BillingTimelineItem[];
  } catch (error) {
    console.error('Erro ao ler timeline de cobrança:', error);
    return [];
  }
};

const writeTimeline = (items: BillingTimelineItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('billing:timeline-updated'));
};

export const syncBillingTimeline = ({
  rule,
  stages,
  dueDate,
  paid,
  context
}: {
  rule: BillingRule;
  stages: BillingRuleStage[];
  dueDate: Date;
  paid: boolean;
  context: BillingContext;
}) => {
  const previous = readTimeline();
  const baseDate = new Date(dueDate);
  const next = stages
    .filter(stage => stage.active && stage.channel && stage.action)
    .map(stage => {
      const scheduledDate = addDays(baseDate, stage.offsetDays);
      const id = toKey(context.contractId, context.invoiceId, stage.id);
      const stored = previous.find(item => item.id === id);
      const shouldCancel = paid && isAfter(scheduledDate, new Date());
      const status = shouldCancel ? 'cancelado' : stored?.status ?? 'pendente';
      return {
        id,
        stageId: stage.id,
        label: stage.label,
        scheduledAt: scheduledDate.toISOString(),
        status,
        channel: stage.channel ?? '---',
        action: stage.action ?? '---',
        contractId: context.contractId,
        invoiceId: context.invoiceId,
        billingRuleId: rule.id,
        logs: stored?.logs ?? []
      } satisfies BillingTimelineItem;
    });

  const merged = [
    ...previous.filter(item => item.contractId !== context.contractId || item.invoiceId !== context.invoiceId),
    ...next
  ];
  writeTimeline(merged);
  return next;
};

export const getBillingTimeline = (context?: Partial<BillingContext>) => {
  const items = readTimeline();
  if (!context) return items;
  return items.filter(item => {
    if (context.contractId && item.contractId !== context.contractId) return false;
    if (context.invoiceId && item.invoiceId !== context.invoiceId) return false;
    return true;
  });
};

export const getBillingAgendaEvents = () => {
  return readTimeline().map<Event>(item => {
    const start = new Date(item.scheduledAt);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    return {
      id: item.id,
      eventId: item.id,
      title: item.label,
      start,
      end,
      calendar: 'work',
      status: item.status === 'executado' ? 'completed' : item.status === 'cancelado' ? 'cancelled' : 'pending',
      source: 'Cobrança automática',
      sourceType: 'BillingRule',
      contractId: item.contractId,
      invoiceId: item.invoiceId,
      billingRuleId: item.billingRuleId,
      billingRuleStepId: item.stageId,
      billingStatus: item.status,
      billingLogs: item.logs
    };
  });
};

export const updateBillingTimelineFromAgenda = (
  eventId: string,
  updates: Partial<Pick<BillingTimelineItem, 'scheduledAt' | 'status' | 'logs'>>
) => {
  const items = readTimeline();
  const next = items.map(item => {
    if (item.id !== eventId) return item;
    const logs = updates.logs ?? item.logs;
    return {
      ...item,
      scheduledAt: updates.scheduledAt ?? item.scheduledAt,
      status: updates.status ?? item.status,
      logs
    };
  });
  writeTimeline(next);
};

export const appendBillingLog = (eventId: string, message: string) => {
  const items = readTimeline();
  const next = items.map(item => {
    if (item.id !== eventId) return item;
    return {
      ...item,
      logs: [...item.logs, message]
    };
  });
  writeTimeline(next);
};
