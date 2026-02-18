import {
  listRelatorioLeads,
  listRelatorioImoveis,
  listRelatorioCorretores,
  listRelatorioAgenda,
  listRelatorioServicos,
  listRelatorioDistribuicao,
  listRelatorioApi,
} from '@/services/reportsService'

interface ListResult {
  rows: any[]
  pagination: { total: number }
}

const FETCH_MAP: Record<string, (
  filters: Record<string, any>,
  page: number,
  pageSize: number,
) => Promise<ListResult>> = {
  leads: listRelatorioLeads,
  imoveis: listRelatorioImoveis,
  corretores: listRelatorioCorretores,
  agenda: listRelatorioAgenda,
  servicos: listRelatorioServicos,
  distribuicao: listRelatorioDistribuicao,
  api: listRelatorioApi,
}

export async function exportReports(
  tab: string,
  filters: Record<string, any>,
): Promise<any[]> {
  const fetch = FETCH_MAP[tab]
  if (!fetch) return []

  const pageSize = 100
  let page = 1
  let allRows: any[] = []

  while (true) {
    const { rows, pagination } = await fetch(filters, page, pageSize)
    allRows = allRows.concat(rows)
    if (allRows.length >= pagination.total || rows.length === 0) {
      break
    }
    page++
  }

  return allRows
}
