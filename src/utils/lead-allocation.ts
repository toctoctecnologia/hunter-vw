import type { Fila, UsuarioFila, Regra } from '@/types/filas';

export interface LeadData {
  id: string;
  titulo?: string;
  bairro?: string;
  cidade?: string;
  fonte?: string;
  etiquetas?: string[];
  preco?: number;
  tipoNegociacao?: string;
  diasMemoria?: number;
  keywords?: string[];
  facebookPagina?: string;
  facebookFormulario?: string;
  [key: string]: any;
}

/**
 * Verifica se um lead atende aos critérios de uma regra
 */
export function avaliarRegra(lead: LeadData, regra: Regra): boolean {
  const valor = lead[regra.campo];
  
  if (valor === undefined || valor === null) {
    return false;
  }

  switch (regra.operador) {
    case 'contém':
      return String(valor).toLowerCase().includes(String(regra.valor).toLowerCase());
    
    case 'igual':
      return String(valor).toLowerCase() === String(regra.valor).toLowerCase();
    
    case 'maior':
      return Number(valor) > Number(regra.valor);
    
    case 'menor':
      return Number(valor) < Number(regra.valor);
    
    case 'entre':
      if (Array.isArray(regra.valor) && regra.valor.length === 2) {
        const num = Number(valor);
        return num >= regra.valor[0] && num <= regra.valor[1];
      }
      return false;
    
    case 'qualquer':
      return true;
    
    default:
      return false;
  }
}

/**
 * Verifica se um lead atende a todas as regras de uma fila
 */
export function leadAtendeRegras(lead: LeadData, fila: Fila): boolean {
  if (fila.regras.length === 0) {
    return true; // Fila sem regras aceita qualquer lead
  }
  
  return fila.regras.every(regra => avaliarRegra(lead, regra));
}

/**
 * Verifica se um usuário está disponível para receber leads
 */
export function isUsuarioDisponivel(
  usuario: UsuarioFila, 
  configHorario: Fila['configHorarioCheckin']
): boolean {
  if (!usuario.ativo) {
    return false;
  }

  // Se não exige check-in e não tem janela de horário, está sempre disponível
  if (!configHorario.exigeCheckin && !configHorario.habilitarJanela) {
    return true;
  }

  const agora = new Date();
  
  // Verificar janela de horário
  if (configHorario.habilitarJanela) {
    const diasSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const diaAtual = diasSemana[agora.getDay()];
    
    if (!configHorario.diasSemana.includes(diaAtual as any)) {
      return false;
    }
    
    const horaAtual = agora.getHours() * 60 + agora.getMinutes();
    const [horaInicioH, horaInicioM] = configHorario.horaInicio.split(':').map(Number);
    const [horaFimH, horaFimM] = configHorario.horaFim.split(':').map(Number);
    const horaInicio = horaInicioH * 60 + horaInicioM;
    const horaFim = horaFimH * 60 + horaFimM;
    
    if (horaAtual < horaInicio || horaAtual > horaFim) {
      return false;
    }
  }

  // Verificar check-in se exigido
  if (configHorario.exigeCheckin && !usuario.disponivelAgora) {
    return false;
  }

  return true;
}

/**
 * Seleciona o próximo usuário disponível na fila seguindo a rotação
 */
export function selecionarProximoUsuario(fila: Fila): UsuarioFila | null {
  const usuariosElegiveis = fila.usuarios
    .filter(usuario => isUsuarioDisponivel(usuario, fila.configHorarioCheckin))
    .sort((a, b) => a.ordemRotacao - b.ordemRotacao);

  if (usuariosElegiveis.length === 0) {
    return null;
  }

  // Encontrar o próximo usuário baseado no último que recebeu lead
  let proximoIndex = 0;
  
  if (fila.proximoUsuarioId) {
    const ultimoIndex = usuariosElegiveis.findIndex(u => u.id === fila.proximoUsuarioId);
    if (ultimoIndex !== -1) {
      proximoIndex = (ultimoIndex + 1) % usuariosElegiveis.length;
    }
  }

  const usuarioSelecionado = usuariosElegiveis[proximoIndex];
  
  return usuarioSelecionado;
}

/**
 * Atualiza a rotação após distribuir um lead
 */
export function atualizarRotacao(fila: Fila, usuarioSelecionado: UsuarioFila): void {
  // Atualizar o próximo usuário para a próxima distribuição
  const usuariosAtivos = fila.usuarios
    .filter(u => u.ativo)
    .sort((a, b) => a.ordemRotacao - b.ordemRotacao);

  if (usuariosAtivos.length === 0) {
    fila.proximoUsuarioId = undefined;
    return;
  }

  const currentIndex = usuariosAtivos.findIndex(u => u.id === usuarioSelecionado.id);
  const nextIndex = (currentIndex + 1) % usuariosAtivos.length;
  fila.proximoUsuarioId = usuariosAtivos[nextIndex].id;

  // Se preservar posição está desabilitado, reordenar usuários indisponíveis
  if (!fila.configAvancadas.preservarPosicaoIndisponivel) {
    const indisponiveis = fila.usuarios.filter(u => 
      u.ativo && !isUsuarioDisponivel(u, fila.configHorarioCheckin)
    );
    
    // Mover usuários indisponíveis para o final da rotação
    indisponiveis.forEach(usuario => {
      const maxOrdem = Math.max(...fila.usuarios.map(u => u.ordemRotacao));
      usuario.ordemRotacao = maxOrdem + 1;
    });
    
    // Reordenar numeração
    fila.usuarios
      .sort((a, b) => a.ordemRotacao - b.ordemRotacao)
      .forEach((usuario, index) => {
        usuario.ordemRotacao = index + 1;
      });
  }
}

/**
 * Encontra a primeira fila compatível com o lead
 */
export function encontrarFilaCompativel(lead: LeadData, filas: Fila[]): Fila | null {
  const filasOrdenadas = filas
    .filter(fila => fila.habilitada)
    .sort((a, b) => a.prioridade - b.prioridade);

  return filasOrdenadas.find(fila => leadAtendeRegras(lead, fila)) || null;
}

/**
 * Distribui um lead para a fila apropriada
 */
export function distribuirLead(lead: LeadData, filas: Fila[]): {
  fila: Fila | null;
  usuario: UsuarioFila | null;
  represado: boolean;
  motivo?: string;
} {
  const fila = encontrarFilaCompativel(lead, filas);
  
  if (!fila) {
    return {
      fila: null,
      usuario: null,
      represado: false,
      motivo: 'Nenhuma fila compatível encontrada'
    };
  }

  const usuario = selecionarProximoUsuario(fila);
  
  if (!usuario) {
    return {
      fila,
      usuario: null,
      represado: true,
      motivo: 'Nenhum usuário disponível na fila'
    };
  }

  // Atualizar rotação
  atualizarRotacao(fila, usuario);
  
  // Incrementar contadores
  if (fila.leadsRecebidos !== undefined) {
    fila.leadsRecebidos++;
  }

  return {
    fila,
    usuario,
    represado: false
  };
}

/**
 * Redistribui leads represados quando usuários ficam disponíveis
 */
export function redistribuirLeadsRepresados(filas: Fila[], leadsRepresados: LeadData[]): {
  distribuidos: Array<{
    lead: LeadData;
    fila: Fila;
    usuario: UsuarioFila;
  }>;
  aindaRepresados: LeadData[];
} {
  const distribuidos: Array<{
    lead: LeadData;
    fila: Fila;
    usuario: UsuarioFila;
  }> = [];
  const aindaRepresados: LeadData[] = [];

  leadsRepresados.forEach(lead => {
    const resultado = distribuirLead(lead, filas);
    
    if (resultado.fila && resultado.usuario && !resultado.represado) {
      distribuidos.push({
        lead,
        fila: resultado.fila,
        usuario: resultado.usuario
      });
    } else {
      aindaRepresados.push(lead);
    }
  });

  return { distribuidos, aindaRepresados };
}