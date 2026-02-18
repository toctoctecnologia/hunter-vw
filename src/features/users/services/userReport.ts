import type { UserReportData } from '@/features/users/types';
import { exportReport } from '@/utils/exportReport';

interface ReportRow {
  section: string;
  field: string;
  value: string;
}

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
});

function formatDate(value: string | null | undefined) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('pt-BR');
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number') return numberFormatter.format(value);
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (Array.isArray(value)) {
    return value
      .map(item => {
        if (typeof item === 'object' && item !== null) {
          return Object.entries(item)
            .map(([key, val]) => `${formatLabel(key)}: ${formatValue(val)}`)
            .join(' | ');
        }
        return formatValue(item);
      })
      .join('; ');
  }
  return String(value);
}

function formatLabel(label: string): string {
  return label
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, char => char.toUpperCase());
}

function buildReportRows(data: UserReportData): ReportRow[] {
  const rows: ReportRow[] = [];

  const pushRow = (section: string, field: string, value: unknown) => {
    rows.push({ section, field, value: formatValue(value) });
  };

  const personal = data.personalInfo;
  pushRow('Dados pessoais', 'ID', personal.id);
  pushRow('Dados pessoais', 'Nome', personal.name);
  pushRow('Dados pessoais', 'E-mail', personal.email ?? '-');
  pushRow('Dados pessoais', 'Telefone', personal.phone ?? '-');
  pushRow('Dados pessoais', 'Função', personal.role ?? '-');
  if (personal.city || personal.uf) {
    pushRow('Dados pessoais', 'Localização', [personal.city, personal.uf].filter(Boolean).join('/'));
  }
  pushRow('Dados pessoais', 'Data de admissão', formatDate(personal.admissionDate ?? null));

  if (data.metrics?.resumo) {
    Object.entries(data.metrics.resumo).forEach(([key, value]) => {
      pushRow('Métricas (Resumo)', formatLabel(key), value);
    });
  }

  if (data.metrics?.vacancia?.length) {
    data.metrics.vacancia.forEach(item => {
      pushRow(
        'Indicadores - Vacância',
        formatDate(item.mes),
        `Vendeu: ${item.vendeu ? 'Sim' : 'Não'} | Vendas: ${numberFormatter.format(item.vendasQtd)}`,
      );
    });
  }

  if (data.indicators.followUpRate !== undefined && data.indicators.followUpRate !== null) {
    pushRow('Indicadores', 'Taxa de follow-up', `${numberFormatter.format(data.indicators.followUpRate)}%`);
  }

  if (data.roletaoStatus) {
    pushRow('Roletão', 'Status', formatLabel(data.roletaoStatus.state));
    pushRow('Roletão', 'Pode reivindicar roletão', data.roletaoStatus.canClaimRoletao);
    pushRow('Roletão', 'Agendado para', formatDate(data.roletaoStatus.scheduledFor));
    pushRow('Roletão', 'Última ação', formatDate(data.roletaoStatus.lastActionAt));
  }

  if (data.observations) {
    pushRow('Observações', 'Checkpoint', data.observations);
  }

  return rows;
}

function exportUserReport(
  userId: string,
  data: UserReportData,
  format: 'csv' | 'xlsx' | 'pdf',
  filenameExtension: string,
) {
  const rows = buildReportRows(data);

  exportReport({
    format,
    section: `usuario_${userId}`,
    data: rows,
    columns: [
      { key: 'section', label: 'Seção' },
      { key: 'field', label: 'Campo' },
      { key: 'value', label: 'Valor' },
    ],
    filename: `relatorio_corretor_${userId}.${filenameExtension}`,
  });
}

export async function generateUserReportPDF(userId: string, data: UserReportData) {
  exportUserReport(userId, data, 'pdf', 'pdf');
}

export async function generateUserReportExcel(userId: string, data: UserReportData) {
  exportUserReport(userId, data, 'xlsx', 'xlsx');
}

export async function generateUserReportCSV(userId: string, data: UserReportData) {
  exportUserReport(userId, data, 'csv', 'csv');
}
