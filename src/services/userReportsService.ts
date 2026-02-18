import React from 'react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { toast } from '@/components/ui/use-toast';
import type {
  KpiDetalhado,
  KpiResumo,
  UserReportData,
  VacanciaMensal,
  DeactivationState,
} from '@/features/users/types';
import type { User } from '@/mocks/users';
import {
  getUserDeactivationStatus,
  getUserDetail,
  getUserHealthSnapshot,
  getUserMetrics,
} from './users';

interface ReportRow {
  label: string;
  value: string;
}

interface ReportSection {
  title: string;
  rows: ReportRow[];
}

const numberFormatter = new Intl.NumberFormat('pt-BR');
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function formatPercentage(value: number | null | undefined, fractionDigits = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '-';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value);
}

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '-';
  }
  return currencyFormatter.format(value);
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '-';
  }
  return numberFormatter.format(value);
}

function formatDateValue(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }

  try {
    return format(new Date(value), 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Não foi possível formatar a data', error);
    return value;
  }
}

function formatDateTimeValue(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }

  try {
    return format(new Date(value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error('Não foi possível formatar a data/hora', error);
    return value;
  }
}

function formatVacancyMonth(value: string): string {
  try {
    const [year, month] = value.split('-');
    if (!year || !month) {
      return value;
    }
    const date = new Date(Number(year), Number(month) - 1, 1);
    return format(date, 'MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Não foi possível formatar o mês de vacância', error);
    return value;
  }
}

function combineCityUf(city?: string | null, uf?: string | null): string {
  if (!city && !uf) {
    return '-';
  }

  if (city && uf) {
    return `${city}/${uf}`;
  }

  return city ?? uf ?? '-';
}

function formatRoletaoState(state: DeactivationState): string {
  switch (state) {
    case 'scheduled':
      return 'Agendamento ativo';
    case 'deactivated':
      return 'Desativado';
    case 'idle':
    default:
      return 'Ativo';
  }
}

function sanitizeSheetName(title: string): string {
  const forbidden = new Set(['\\', '/', '*', '?', '[', ']']);
  const sanitized = title
    .split('')
    .map(char => (forbidden.has(char) ? ' ' : char))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

  if (sanitized.length === 0) {
    return 'Relatório';
  }

  if (sanitized.length <= 31) {
    return sanitized;
  }

  return sanitized.slice(0, 31);
}

function triggerFileDownload(blob: Blob, filename: string) {
  if (typeof window === 'undefined') {
    console.warn('Geração de arquivos disponível apenas no navegador.');
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildMetricsRows(resumo: KpiResumo | null | undefined, vacancia: VacanciaMensal[] | null | undefined): ReportRow[] {
  const rows: ReportRow[] = [];

  if (resumo) {
    const conversionRate = resumo.leadsRecebidos ? resumo.vendas / resumo.leadsRecebidos : null;

    rows.push({ label: 'Captações', value: formatNumber(resumo.captacoes) });
    rows.push({ label: 'Imóveis vendidos', value: formatNumber(resumo.vendasQtd) });
    rows.push({ label: 'Valor vendido', value: formatCurrency(resumo.vendasValorTotal) });
    rows.push({ label: 'Leads recebidos', value: formatNumber(resumo.leadsRecebidos) });
    rows.push({ label: 'Visitas realizadas', value: formatNumber(resumo.visitas) });
    rows.push({ label: 'Propostas enviadas', value: formatNumber(resumo.propostas) });
    rows.push({ label: 'Vendas concluídas', value: formatNumber(resumo.vendas) });
    rows.push({ label: 'Ticket médio', value: formatCurrency(resumo.ticketMedio) });
    rows.push({ label: 'Tempo médio de fechamento', value: resumo.tempoMedioFechamentoDias ? `${resumo.tempoMedioFechamentoDias} dias` : '-' });
    rows.push({ label: 'Taxa de conversão', value: formatPercentage(conversionRate, 1) });
    rows.push({ label: 'Taxa de follow-up', value: formatPercentage(resumo.taxaFollowUp, 0) });
    rows.push({ label: 'Agenda cumprida', value: formatPercentage(resumo.agendaCumprida, 0) });
    rows.push({ label: 'Tempo médio de resposta', value: resumo.tempoMedioRespostaMin ? `${resumo.tempoMedioRespostaMin} min` : '-' });
    rows.push({ label: 'Uso das ferramentas', value: formatPercentage(resumo.usoFerramentasScore, 0) });
    rows.push({ label: 'NPS', value: formatNumber(resumo.nps) });
    rows.push({ label: 'Indicações recebidas', value: formatNumber(resumo.indicacoes) });
    rows.push({ label: 'Retenção de clientes', value: formatNumber(resumo.retencoes) });
  }

  if (vacancia && vacancia.length > 0) {
    vacancia.forEach(item => {
      rows.push({
        label: `Vacância ${formatVacancyMonth(item.mes)}`,
        value: `${item.vendeu ? 'Vendeu' : 'Não vendeu'} • ${formatNumber(item.vendasQtd)} venda(s)`,
      });
    });
  }

  return rows;
}

function buildReportSections(data: UserReportData): ReportSection[] {
  const sections: ReportSection[] = [];

  const personalInfoRows: ReportRow[] = [
    { label: 'ID', value: data.personalInfo.id ?? '-' },
    { label: 'Nome', value: data.personalInfo.name ?? '-' },
    { label: 'E-mail', value: data.personalInfo.email ?? '-' },
    { label: 'Telefone', value: data.personalInfo.phone ?? '-' },
    { label: 'Função', value: data.personalInfo.role ?? '-' },
    { label: 'Localização', value: combineCityUf(data.personalInfo.city, data.personalInfo.uf) },
    { label: 'Data de admissão', value: formatDateValue(data.personalInfo.admissionDate ?? null) },
  ];

  sections.push({ title: 'Dados do corretor', rows: personalInfoRows });

  const resumo = data.metrics?.resumo ?? null;
  const vacancia = data.metrics?.vacancia ?? data.indicators.vacancia ?? null;
  const metricsRows = buildMetricsRows(resumo, vacancia ?? undefined);

  if (!resumo && data.indicators?.followUpRate !== undefined && data.indicators.followUpRate !== null) {
    metricsRows.push({ label: 'Taxa de follow-up', value: formatPercentage(data.indicators.followUpRate, 0) });
  }

  if (metricsRows.length > 0) {
    sections.push({ title: 'Métricas', rows: metricsRows });
  }

  const roletaoRows: ReportRow[] = [
    { label: 'Status', value: formatRoletaoState(data.roletaoStatus.state) },
    { label: 'Pode reivindicar roletão', value: data.roletaoStatus.canClaimRoletao ? 'Sim' : 'Não' },
    { label: 'Agendado para', value: formatDateTimeValue(data.roletaoStatus.scheduledFor) },
    { label: 'Última ação', value: formatDateTimeValue(data.roletaoStatus.lastActionAt) },
  ];

  sections.push({ title: 'Status Roletão', rows: roletaoRows });

  const observationText = data.observations?.trim() || 'Sem observações registradas.';
  sections.push({ title: 'Observações', rows: [{ label: 'Resumo', value: observationText }] });

  return sections;
}

function handleError(error: unknown, message: string) {
  console.error(message, error);
  toast({
    title: 'Não foi possível concluir a exportação',
    description: message,
    variant: 'destructive',
  });
}

export async function fetchUserReportData(userId: string): Promise<UserReportData> {
  const [detailResult, metricsResult, deactivationResult] = await Promise.allSettled([
    getUserDetail(userId),
    getUserMetrics(userId),
    getUserDeactivationStatus(userId),
  ]);

  if (detailResult.status !== 'fulfilled') {
    throw detailResult.reason ?? new Error('Não foi possível carregar os dados do corretor.');
  }

  const detail = detailResult.value as User & {
    city?: string | null;
    uf?: string | null;
    admissionDate?: string | null;
    checkpointReason?: string | null;
  };

  const metrics = metricsResult.status === 'fulfilled' ? (metricsResult.value as KpiDetalhado) : null;
  if (metricsResult.status === 'rejected') {
    console.error('Falha ao obter métricas do corretor.', metricsResult.reason);
  }

  const deactivationStatus =
    deactivationResult.status === 'fulfilled' ? deactivationResult.value : null;
  if (deactivationResult.status === 'rejected') {
    console.error('Falha ao obter status de desativação.', deactivationResult.reason);
  }

  let healthSnapshot = detail.healthSnapshot ?? null;
  if (!healthSnapshot) {
    try {
      healthSnapshot = await getUserHealthSnapshot(userId);
    } catch (error) {
      console.error('Não foi possível carregar o checkpoint mais recente.', error);
    }
  }

  const resumo = metrics?.resumo ?? null;
  const vacancia = metrics?.vacancia ?? null;
  const followUpRate = resumo?.taxaFollowUp ?? null;

  const stateFromDeactivation = deactivationStatus?.state ?? (detail.active ? 'idle' : 'deactivated');

  return {
    personalInfo: {
      id: detail.id,
      name: detail.name,
      email: detail.email ?? null,
      phone: detail.phone ?? null,
      role: detail.role ?? null,
      city: detail.city ?? null,
      uf: detail.uf ?? null,
      admissionDate: detail.admissionDate ?? null,
    },
    metrics: metrics
      ? {
          resumo,
          vacancia,
        }
      : null,
    indicators: {
      followUpRate,
      vacancia,
    },
    roletaoStatus: {
      state: stateFromDeactivation,
      scheduledFor: deactivationStatus?.scheduledFor ?? null,
      lastActionAt: deactivationStatus?.lastActionAt ?? null,
      canClaimRoletao: detail.canClaimRoletao ?? Boolean(detail.roletaoEnabled),
    },
    observations: healthSnapshot?.checkpointReason ?? detail.checkpointReason ?? null,
  };
}

export async function generateUserReportPDF(userId: string): Promise<void> {
  try {
    const { pdf, Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer');
    const data = await fetchUserReportData(userId);
    const sections = buildReportSections(data);

    const styles = StyleSheet.create({
      page: {
        padding: 32,
        fontSize: 12,
        fontFamily: 'Helvetica',
        color: '#1f2933',
      },
      header: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 8,
      },
      subHeader: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 24,
      },
      section: {
        marginBottom: 18,
      },
      sectionTitle: {
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 4,
      },
      row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        gap: 12,
      },
      rowLabel: {
        fontWeight: 600,
      },
      rowValue: {
        flex: 1,
        textAlign: 'right',
      },
    });

    const generatedAt = format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

    const pdfContent = React.createElement(
      Document,
      { title: `Relatório do corretor ${data.personalInfo.name}` },
      React.createElement(
        Page,
        { size: 'A4', style: styles.page },
        React.createElement(Text, { style: styles.header }, 'Relatório do corretor'),
        React.createElement(Text, { style: styles.subHeader }, `Gerado em ${generatedAt}`),
        ...sections.map(section => {
          const sectionRows = section.rows.map(row => {
            const children: React.ReactNode[] = [];
            if (row.label) {
              children.push(React.createElement(Text, { style: styles.rowLabel, key: 'label' }, `${row.label}:`));
            }
            children.push(
              React.createElement(Text, { style: styles.rowValue, key: 'value' }, row.value),
            );

            return React.createElement(
              View,
              { style: styles.row, key: `${section.title}-${row.label}` },
              ...children,
            );
          });

          return React.createElement(
            View,
            { style: styles.section, key: section.title },
            React.createElement(Text, { style: styles.sectionTitle }, section.title),
            ...sectionRows,
          );
        }),
      ),
    );

    const blob = await pdf(pdfContent).toBlob();
    triggerFileDownload(blob, `relatorio_corretor_${userId}.pdf`);
  } catch (error) {
    handleError(error, 'Não foi possível gerar o relatório em PDF.');
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function generateUserReportExcel(userId: string): Promise<void> {
  try {
    const data = await fetchUserReportData(userId);
    const sections = buildReportSections(data);

    const workbook = XLSX.utils.book_new();

    sections.forEach(section => {
      const rows: Array<Array<string>> = [];
      rows.push([section.title]);
      rows.push(['Campo', 'Valor']);
      section.rows.forEach(row => {
        rows.push([row.label || section.title, row.value]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sanitizeSheetName(section.title));
    });

    const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([arrayBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    triggerFileDownload(blob, `relatorio_corretor_${userId}.xlsx`);
  } catch (error) {
    handleError(error, 'Não foi possível gerar o relatório em Excel.');
    throw error instanceof Error ? error : new Error(String(error));
  }
}

export async function generateUserReportCSV(userId: string): Promise<void> {
  try {
    const data = await fetchUserReportData(userId);
    const sections = buildReportSections(data);

    const flatRows: Array<Array<string>> = [];
    sections.forEach(section => {
      flatRows.push([section.title]);
      flatRows.push(['Campo', 'Valor']);
      section.rows.forEach(row => {
        flatRows.push([row.label || section.title, row.value]);
      });
      flatRows.push(['']);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(flatRows);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    triggerFileDownload(blob, `relatorio_corretor_${userId}.csv`);
  } catch (error) {
    handleError(error, 'Não foi possível gerar o relatório em CSV.');
    throw error instanceof Error ? error : new Error(String(error));
  }
}
