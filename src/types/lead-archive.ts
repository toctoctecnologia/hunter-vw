export interface ArchiveReason {
  code: string;
  label: string;
}

export const ARCHIVE_REASONS: ArchiveReason[] = [
  { code: 'ALUGADO', label: 'Alugado' },
  { code: 'APENAS_PESQUISANDO', label: 'Apenas pesquisando' },
  { code: 'AVALIACAO_BAIXA_NA_TROCA', label: 'Avaliação baixa na troca' },
  { code: 'CLIENTE_NAO_RESPONDEU', label: 'Cliente não respondeu' },
  { code: 'COMPRA_ADIADA', label: 'Compra adiada' },
  { code: 'CONTATO_INVALIDO', label: 'Contato inválido' },
  { code: 'CORRETOR_PARCEIRO', label: 'Corretor parceiro' },
  { code: 'DDD_DISTANTE', label: 'DDD distante' },
  { code: 'DE_PLANILHA', label: 'De planilha' },
  { code: 'FALTA_DE_PRODUTO', label: 'Falta de produto' },
  { code: 'FATURADO', label: 'Faturado' },
  { code: 'PRAZO_DE_ENTREGA', label: 'Prazo de entrega' },
  { code: 'PRECO_ALTO', label: 'Preço alto' },
  { code: 'PROBLEMA_NO_ATENDIMENTO', label: 'Problema no atendimento' },
  { code: 'PRODUTO_NA_TROCA_NAO_INTERESSA_PARA_A_LOJA', label: 'Produto na troca não interessa para a loja' },
  { code: 'PRODUTO_NAO_AGRADOU', label: 'Produto não agradou' },
  { code: 'PROPOSTA_DO_CLIENTE_COM_VALOR_BAIXO', label: 'Proposta do cliente com valor baixo' },
  { code: 'PROPOSTA_INVIAVEL', label: 'Proposta inviável' },
  { code: 'TRATADA_COM_QUALIFICACAO', label: 'Tratada com qualificação' },
  { code: 'TRATADA_SEM_QUALIFICACAO', label: 'Tratada sem qualificação' },
  { code: 'VENDEDOR_PESQUISANDO_PRODUTO', label: 'Vendedor pesquisando produto' },
  { code: 'OUTROS', label: 'Outros' }
];
