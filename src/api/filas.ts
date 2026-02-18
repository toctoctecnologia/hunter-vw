import type { Fila, AuditoriaEvento, CaptacaoLead, CheckinStatus, UsuarioFila } from '@/types/filas';
import { httpJSON } from '@/lib/http';

// Mock data
const mockFilas: Fila[] = [
  {
    id: '1',
    tipo: 'Personalizada',
    nome: 'Captação de Corretor',
    prioridade: 1,
    regras: [
      {
        id: '1',
        campo: 'titulo',
        operador: 'contém',
        valor: 'SEJA UM CORRETOR'
      }
    ],
    usuarios: [
      {
        id: '1',
        nome: 'Daiane Pulz Minotto',
        email: 'daiane@empresa.com',
        ativo: true,
        disponivelAgora: true,
        ordemRotacao: 1,
        ultimoCheckin: new Date().toISOString()
      }
    ],
    proximoUsuarioId: '1',
    leadsRecebidos: 15,
    ativosNaFila: 1,
    configHorarioCheckin: {
      habilitarJanela: true,
      diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex'],
      horaInicio: '08:00',
      horaFim: '18:00',
      exigeCheckin: true,
      habilitarQrCode: false
    },
    configAvancadas: {
      redistribuicaoAtiva: false,
      preservarPosicaoIndisponivel: false,
      destinoDistribuicao: 'roletao'
    },
    habilitada: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    tipo: 'Personalizada',
    nome: 'Regra de Memória',
    prioridade: 2,
    regras: [
      {
        id: '2',
        campo: 'diasMemoria',
        operador: 'menor',
        valor: 365
      }
    ],
    usuarios: [
      {
        id: '2',
        nome: 'Marcelo Rosset',
        email: 'marcelo@empresa.com',
        ativo: true,
        disponivelAgora: true,
        ordemRotacao: 1,
        ultimoCheckin: new Date().toISOString()
      },
      {
        id: '3',
        nome: 'Ana Silva',
        email: 'ana@empresa.com',
        ativo: true,
        disponivelAgora: false,
        ordemRotacao: 2
      }
    ],
    proximoUsuarioId: '2',
    leadsRecebidos: 72,
    ativosNaFila: 2,
    configHorarioCheckin: {
      habilitarJanela: false,
      diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'],
      horaInicio: '00:00',
      horaFim: '23:59',
      exigeCheckin: false,
      habilitarQrCode: false
    },
    configAvancadas: {
      redistribuicaoAtiva: true,
      preservarPosicaoIndisponivel: true,
      destinoDistribuicao: 'proximo_fila'
    },
    habilitada: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    tipo: 'Personalizada',
    nome: 'Central Tower',
    prioridade: 3,
    regras: [
      {
        id: '3',
        campo: 'titulo',
        operador: 'contém',
        valor: 'central tower'
      }
    ],
    usuarios: [
      {
        id: '2',
        nome: 'Marcelo Rosset',
        email: 'marcelo@empresa.com',
        ativo: true,
        disponivelAgora: true,
        ordemRotacao: 1,
        ultimoCheckin: new Date().toISOString()
      }
    ],
    proximoUsuarioId: '2',
    leadsRecebidos: 20,
    ativosNaFila: 1,
    configHorarioCheckin: {
      habilitarJanela: true,
      diasSemana: ['seg', 'ter', 'qua', 'qui', 'sex'],
      horaInicio: '09:00',
      horaFim: '17:00',
      exigeCheckin: true,
      habilitarQrCode: false
    },
    configAvancadas: {
      redistribuicaoAtiva: false,
      preservarPosicaoIndisponivel: false,
      destinoDistribuicao: 'roletao'
    },
    habilitada: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];


// Minimal delay for realistic feel (reduced from 200-800ms to 10-50ms)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const filasApi = {
  async getFilas(): Promise<Fila[]> {
    await delay(10);
    return [...mockFilas].sort((a, b) => a.prioridade - b.prioridade);
  },

  async getFila(id: string): Promise<Fila | null> {
    await delay(10);
    return mockFilas.find(f => f.id === id) || null;
  },

  async createFila(payload: Omit<Fila, 'id' | 'createdAt' | 'updatedAt'>): Promise<Fila> {
    await delay(20);
    const newFila: Fila = {
      ...payload,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockFilas.push(newFila);
    return newFila;
  },

  async updateFila(id: string, payload: Partial<Fila>): Promise<Fila> {
    await delay(20);
    const index = mockFilas.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Fila não encontrada');
    
    mockFilas[index] = {
      ...mockFilas[index],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    return mockFilas[index];
  },

  async deleteFila(id: string): Promise<void> {
    await delay(10);
    const index = mockFilas.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Fila não encontrada');
    mockFilas.splice(index, 1);
  },

  async reorderFilas(newOrder: string[]): Promise<void> {
    await delay(10);
    newOrder.forEach((id, index) => {
      const fila = mockFilas.find(f => f.id === id);
      if (fila) {
        fila.prioridade = index + 1;
        fila.updatedAt = new Date().toISOString();
      }
    });
  },

  async updateUsuarioNaFila(
    filaId: string,
    usuarioId: string,
    payload: Partial<Pick<UsuarioFila, 'ativo' | 'ordemRotacao' | 'limiteLeadsAbertos' | 'observacao'>>
  ): Promise<UsuarioFila> {
    await delay(10);
    const fila = mockFilas.find(f => f.id === filaId);
    if (!fila) throw new Error('Fila não encontrada');
    const index = fila.usuarios.findIndex(u => u.id === usuarioId);
    if (index === -1) throw new Error('Usuário não encontrado na fila');

    fila.usuarios[index] = {
      ...fila.usuarios[index],
      ...payload
    };

    fila.ativosNaFila = fila.usuarios.filter(u => u.ativo).length;
    fila.proximoUsuarioId = fila.usuarios.find(u => u.ativo)?.id;
    fila.updatedAt = new Date().toISOString();

    return fila.usuarios[index];
  },

  async redistribuirFila(id: string): Promise<void> {
    await delay(30);
    // Simular redistribuição
    console.log(`Redistribuindo fila ${id}`);
  },

  async getAuditoria(params?: {
    page?: number;
    perPage?: number;
    tipo?: string;
    autor?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ items: AuditoriaEvento[]; total: number }> {
    // Mock data for auditoria
    const mockEvents: AuditoriaEvento[] = [
      {
        id: '1',
        tipo: 'DISTRIBUICAO',
        descricao: 'Lead distribuído para corretor',
        autor: 'Sistema',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        filaId: 'fila-1',
        leadId: 'lead-123',
        usuarioId: 'user-1'
      },
      {
        id: '2',
        tipo: 'CHECKIN',
        descricao: 'Daiane Pulz Minotto fez check-in',
        autor: 'Daiane Pulz Minotto',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        filaId: 'fila-1',
        usuarioId: 'user-1'
      },
      {
        id: '3',
        tipo: 'CRIACAO',
        descricao: 'Nova fila "Captação de Corretor" criada',
        autor: 'Admin',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        filaId: 'fila-1'
      },
      {
        id: '4',
        tipo: 'REDISTRIBUICAO',
        descricao: 'Lead redistribuído por timeout',
        autor: 'Sistema',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        filaId: 'fila-2',
        leadId: 'lead-456'
      },
      {
        id: '5',
        tipo: 'EDICAO',
        descricao: 'Configurações de fila alteradas',
        autor: 'Marcelo Rosset',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        filaId: 'fila-2'
      }
    ];

    // Apply filters
    let filtered = [...mockEvents];
    if (params?.tipo) {
      filtered = filtered.filter(e => e.tipo === params.tipo);
    }
    if (params?.autor) {
      filtered = filtered.filter(e => e.autor.toLowerCase().includes(params.autor!.toLowerCase()));
    }
    if (params?.startDate) {
      filtered = filtered.filter(e => new Date(e.timestamp) >= new Date(params.startDate!));
    }
    if (params?.endDate) {
      filtered = filtered.filter(e => new Date(e.timestamp) <= new Date(params.endDate!));
    }

    // Pagination
    const page = params?.page ?? 1;
    const perPage = params?.perPage ?? 10;
    const start = (page - 1) * perPage;
    const items = filtered.slice(start, start + perPage);

    return {
      items,
      total: filtered.length
    };
  },

  async getCaptacoes(params?: {
    page?: number;
    perPage?: number;
    status?: string;
    origem?: string;
    equipe?: string;
    captador?: string;
    filaId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ items: CaptacaoLead[]; total: number }> {
    // Mock data for captações
    const mockCaptacoes: CaptacaoLead[] = [
      {
        id: '1',
        nome: 'Maria Silva Santos',
        email: 'maria.silva@email.com',
        telefone: '(48) 99999-1234',
        origem: 'Facebook',
        equipe: 'TINIS',
        captador: 'Carlos Lima',
        filaNome: 'Fila Norte',
        campanha: 'Apartamentos Centro',
        formulario: 'Interesse Compra',
        status: 'distribuido',
        filaId: 'fila-1',
        usuarioId: 'user-1',
        dataCaptura: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        nome: 'João Pereira',
        email: 'joao.pereira@gmail.com',
        telefone: '(48) 98888-5678',
        origem: 'Site',
        equipe: 'CHEFIM',
        captador: 'Bia Souza',
        filaNome: 'Fila Digital',
        campanha: 'Landing Page Casas',
        status: 'novo',
        dataCaptura: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      },
      {
        id: '3',
        nome: 'Ana Costa',
        email: 'ana.costa@hotmail.com',
        telefone: '(48) 97777-9999',
        origem: 'Google',
        equipe: 'TINIS',
        captador: 'Leandro Martins',
        filaNome: 'Fila Norte',
        campanha: 'Google Ads - Imóveis',
        status: 'atendido',
        filaId: 'fila-2',
        usuarioId: 'user-2',
        dataCaptura: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: '4',
        nome: 'Carlos Oliveira',
        email: 'carlos@empresa.com',
        telefone: '(48) 96666-3333',
        origem: 'WhatsApp',
        equipe: 'CHEFIM',
        captador: 'Mariana Duarte',
        filaNome: 'Fila Digital',
        status: 'represado',
        dataCaptura: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
      },
      {
        id: '5',
        nome: 'Fernanda Lima',
        email: 'fernanda.lima@outlook.com',
        telefone: '(48) 95555-7777',
        origem: 'Instagram',
        equipe: 'TINIS',
        captador: 'Carlos Lima',
        filaNome: 'Fila Sul',
        campanha: 'Stories Promoção',
        status: 'perdido',
        dataCaptura: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      }
    ];

    // Apply filters
    let filtered = [...mockCaptacoes];
    if (params?.status) {
      filtered = filtered.filter(c => c.status === params.status);
    }
    if (params?.origem) {
      filtered = filtered.filter(c => c.origem === params.origem);
    }
    if (params?.equipe) {
      filtered = filtered.filter(c => c.equipe === params.equipe);
    }
    if (params?.captador) {
      filtered = filtered.filter(c => c.captador === params.captador);
    }
    if (params?.filaId) {
      filtered = filtered.filter(c => c.filaId === params.filaId || c.filaNome === params.filaId);
    }
    if (params?.startDate) {
      filtered = filtered.filter(c => new Date(c.dataCaptura) >= new Date(params.startDate!));
    }
    if (params?.endDate) {
      filtered = filtered.filter(c => new Date(c.dataCaptura) <= new Date(params.endDate!));
    }

    // Pagination
    const page = params?.page ?? 1;
    const perPage = params?.perPage ?? 10;
    const start = (page - 1) * perPage;
    const items = filtered.slice(start, start + perPage);

    return {
      items,
      total: filtered.length
    };
  },

  async getCheckin(): Promise<CheckinStatus[]> {
    // Mock data for check-in status
    const mockCheckinStatus: CheckinStatus[] = [
      {
        usuarioId: 'user-1',
        nome: 'Daiane Pulz Minotto',
        email: 'daiane@empresa.com',
        status: 'online',
        ultimoCheckin: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        filaIds: ['fila-1', 'fila-3'],
        leadsAtivos: 3
      },
      {
        usuarioId: 'user-2',
        nome: 'Marcelo Rosset',
        email: 'marcelo@empresa.com',
        status: 'online',
        ultimoCheckin: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        filaIds: ['fila-2', 'fila-3'],
        leadsAtivos: 5
      },
      {
        usuarioId: 'user-3',
        nome: 'Ana Carolina',
        email: 'ana.carolina@empresa.com',
        status: 'ausente',
        ultimoCheckin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        ultimoCheckout: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        filaIds: ['fila-1'],
        leadsAtivos: 1
      },
      {
        usuarioId: 'user-4',
        nome: 'Rafael Santos',
        email: 'rafael@empresa.com',
        status: 'offline',
        ultimoCheckin: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        ultimoCheckout: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        filaIds: ['fila-2'],
        leadsAtivos: 0
      },
      {
        usuarioId: 'user-5',
        nome: 'Carla Mendes',
        email: 'carla@empresa.com',
        status: 'online',
        ultimoCheckin: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        filaIds: ['fila-1', 'fila-2'],
        leadsAtivos: 2
      }
    ];

    return mockCheckinStatus;
  },

  async forceCheckout(usuarioId: string): Promise<void> {
    // Mock implementation - in real app would call API
    console.log(`Forcing checkout for user: ${usuarioId}`);
    return Promise.resolve();
  }
};