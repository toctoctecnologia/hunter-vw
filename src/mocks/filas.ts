import type { AuditoriaEvento, CaptacaoLead, CheckinStatus } from '@/types/filas';

export const mockAuditoria: AuditoriaEvento[] = [
  {
    id: '1',
    tipo: 'CRIACAO',
    descricao: 'Fila "Captação de Corretor" criada',
    autor: 'Admin Sistema',
    timestamp: new Date().toISOString(),
    filaId: '1'
  },
  {
    id: '2',
    tipo: 'DISTRIBUICAO',
    descricao: 'Lead distribuído para Daiane Pulz Minotto',
    autor: 'Sistema',
    timestamp: new Date().toISOString(),
    filaId: '1',
    usuarioId: '1',
    leadId: 'lead-123'
  },
  {
    id: '3',
    tipo: 'CHECKIN',
    descricao: 'Marcelo Rosset fez check-in',
    autor: 'Marcelo Rosset',
    timestamp: new Date().toISOString(),
    usuarioId: '2'
  }
];

export const mockCaptacoes: CaptacaoLead[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    origem: 'Facebook',
    campanha: 'Imóveis Centro',
    formulario: 'Interesse Apartamento',
    status: 'distribuido',
    filaId: '1',
    usuarioId: '1',
    dataCaptura: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(11) 88888-8888',
    origem: 'Site',
    status: 'represado',
    filaId: '2',
    dataCaptura: new Date().toISOString()
  }
];

export const mockCheckin: CheckinStatus[] = [
  {
    usuarioId: '1',
    nome: 'Daiane Pulz Minotto',
    email: 'daiane@empresa.com',
    status: 'online',
    ultimoCheckin: new Date().toISOString(),
    filaIds: ['1'],
    leadsAtivos: 3
  },
  {
    usuarioId: '2',
    nome: 'Marcelo Rosset',
    email: 'marcelo@empresa.com',
    status: 'online',
    ultimoCheckin: new Date().toISOString(),
    filaIds: ['2', '3'],
    leadsAtivos: 5
  },
  {
    usuarioId: '3',
    nome: 'Ana Silva',
    email: 'ana@empresa.com',
    status: 'offline',
    ultimoCheckout: new Date(Date.now() - 3600000).toISOString(),
    filaIds: ['2'],
    leadsAtivos: 0
  }
];
