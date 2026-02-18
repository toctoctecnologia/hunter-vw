// Modelo de dados completo para Padrão de Contrato
export interface PadraoContrato {
  id: string;
  nome: string;
  duracaoMeses: number;
  indiceReajuste: 'IGP-M' | 'IPCA' | 'INPC' | 'IPC' | 'IVAR' | 'CUB' | 'OUTRO';
  taxaAdministracao: number;
  garantiaPadrao: 'FIADOR' | 'CAUCAO' | 'SEGURO_FIANCA' | 'TITULO_CAPITALIZACAO' | 'NENHUMA';
  status: 'ativo' | 'inativo';
  corpoTemplate: string;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type TipoContratoTemplate = 'locacao' | 'venda';

export interface CampoDinamico {
  id: string;
  label: string;
  placeholder: string;
  descricao?: string;
}

export interface GrupoCamposDinamicos {
  id: string;
  nome: string;
  icone: string;
  campos: CampoDinamico[];
}

const CAMPOS_DINAMICOS_LOCACAO: GrupoCamposDinamicos[] = [
  {
    id: 'contrato',
    nome: 'Contrato',
    icone: 'FileText',
    campos: [
      { id: 'contrato_codigo', label: 'Código do contrato', placeholder: '{{contrato_codigo}}' },
      { id: 'contrato_data_inicio', label: 'Data de início', placeholder: '{{contrato_data_inicio}}' },
      { id: 'contrato_data_fim', label: 'Data de término', placeholder: '{{contrato_data_fim}}' },
      { id: 'contrato_duracao_meses', label: 'Duração (meses)', placeholder: '{{contrato_duracao_meses}}' },
      { id: 'contrato_modalidade_pagamento', label: 'Modalidade de pagamento', placeholder: '{{contrato_modalidade_pagamento}}' },
      { id: 'contrato_indice_reajuste', label: 'Índice de reajuste', placeholder: '{{contrato_indice_reajuste}}' },
      { id: 'contrato_dia_vencimento', label: 'Dia do vencimento', placeholder: '{{contrato_dia_vencimento}}' },
    ],
  },
  {
    id: 'locador',
    nome: 'Locador',
    icone: 'User',
    campos: [
      { id: 'locador_nome_completo', label: 'Nome completo', placeholder: '{{locador_nome_completo}}' },
      { id: 'locador_cpf_cnpj', label: 'CPF/CNPJ', placeholder: '{{locador_cpf_cnpj}}' },
      { id: 'locador_rg', label: 'RG', placeholder: '{{locador_rg}}' },
      { id: 'locador_nacionalidade', label: 'Nacionalidade', placeholder: '{{locador_nacionalidade}}' },
      { id: 'locador_estado_civil', label: 'Estado civil', placeholder: '{{locador_estado_civil}}' },
      { id: 'locador_profissao', label: 'Profissão', placeholder: '{{locador_profissao}}' },
      { id: 'locador_endereco_completo', label: 'Endereço completo', placeholder: '{{locador_endereco_completo}}' },
      { id: 'locador_email', label: 'E-mail', placeholder: '{{locador_email}}' },
      { id: 'locador_telefone', label: 'Telefone', placeholder: '{{locador_telefone}}' },
    ],
  },
  {
    id: 'locatario',
    nome: 'Locatário',
    icone: 'Users',
    campos: [
      { id: 'locatario_nome_completo', label: 'Nome completo', placeholder: '{{locatario_nome_completo}}' },
      { id: 'locatario_cpf_cnpj', label: 'CPF/CNPJ', placeholder: '{{locatario_cpf_cnpj}}' },
      { id: 'locatario_rg', label: 'RG', placeholder: '{{locatario_rg}}' },
      { id: 'locatario_nacionalidade', label: 'Nacionalidade', placeholder: '{{locatario_nacionalidade}}' },
      { id: 'locatario_estado_civil', label: 'Estado civil', placeholder: '{{locatario_estado_civil}}' },
      { id: 'locatario_profissao', label: 'Profissão', placeholder: '{{locatario_profissao}}' },
      { id: 'locatario_endereco_completo', label: 'Endereço completo', placeholder: '{{locatario_endereco_completo}}' },
      { id: 'locatario_email', label: 'E-mail', placeholder: '{{locatario_email}}' },
      { id: 'locatario_telefone', label: 'Telefone', placeholder: '{{locatario_telefone}}' },
    ],
  },
  {
    id: 'imovel',
    nome: 'Imóvel',
    icone: 'Home',
    campos: [
      { id: 'imovel_tipo', label: 'Tipo do imóvel', placeholder: '{{imovel_tipo}}' },
      { id: 'imovel_endereco_completo', label: 'Endereço completo', placeholder: '{{imovel_endereco_completo}}' },
      { id: 'imovel_matricula', label: 'Matrícula', placeholder: '{{imovel_matricula}}' },
      { id: 'imovel_descricao_resumida', label: 'Descrição resumida', placeholder: '{{imovel_descricao_resumida}}' },
      { id: 'imovel_cidade', label: 'Cidade', placeholder: '{{imovel_cidade}}' },
      { id: 'imovel_uf', label: 'UF', placeholder: '{{imovel_uf}}' },
    ],
  },
  {
    id: 'valores',
    nome: 'Valores',
    icone: 'DollarSign',
    campos: [
      { id: 'contrato_valor_aluguel', label: 'Valor do aluguel', placeholder: '{{contrato_valor_aluguel}}' },
      { id: 'contrato_valor_aluguel_extenso', label: 'Aluguel por extenso', placeholder: '{{contrato_valor_aluguel_extenso}}' },
      { id: 'contrato_valor_condominio', label: 'Valor do condomínio', placeholder: '{{contrato_valor_condominio}}' },
      { id: 'contrato_valor_iptu', label: 'Valor do IPTU', placeholder: '{{contrato_valor_iptu}}' },
      { id: 'contrato_taxa_administracao_percentual', label: 'Taxa de administração (%)', placeholder: '{{contrato_taxa_administracao_percentual}}' },
      { id: 'contrato_multa_percentual', label: 'Multa (%)', placeholder: '{{contrato_multa_percentual}}' },
      { id: 'contrato_juros_percentual', label: 'Juros (%)', placeholder: '{{contrato_juros_percentual}}' },
    ],
  },
  {
    id: 'geral',
    nome: 'Informações gerais',
    icone: 'MoreHorizontal',
    campos: [
      { id: 'data_atual_extenso', label: 'Data atual por extenso', placeholder: '{{data_atual_extenso}}' },
      { id: 'nome_imobiliaria', label: 'Nome da imobiliária', placeholder: '{{nome_imobiliaria}}' },
      { id: 'cnpj_imobiliaria', label: 'CNPJ da imobiliária', placeholder: '{{cnpj_imobiliaria}}' },
      { id: 'creci_imobiliaria', label: 'CRECI da imobiliária', placeholder: '{{creci_imobiliaria}}' },
      { id: 'endereco_imobiliaria', label: 'Endereço da imobiliária', placeholder: '{{endereco_imobiliaria}}' },
    ],
  },
];

const CAMPOS_DINAMICOS_VENDA: GrupoCamposDinamicos[] = [
  {
    id: 'contrato_venda',
    nome: 'Contrato',
    icone: 'FileText',
    campos: [
      { id: 'contrato_codigo', label: 'Código do contrato', placeholder: '{{contrato_codigo}}' },
      { id: 'contrato_data_assinatura', label: 'Data de assinatura', placeholder: '{{contrato_data_assinatura}}' },
      { id: 'contrato_prazo_escritura_dias', label: 'Prazo para escritura (dias)', placeholder: '{{contrato_prazo_escritura_dias}}' },
      { id: 'contrato_forma_pagamento', label: 'Forma de pagamento', placeholder: '{{contrato_forma_pagamento}}' },
      { id: 'contrato_indice_correcao', label: 'Índice de correção', placeholder: '{{contrato_indice_correcao}}' },
    ],
  },
  {
    id: 'vendedor',
    nome: 'Vendedor',
    icone: 'User',
    campos: [
      { id: 'vendedor_nome_completo', label: 'Nome completo', placeholder: '{{vendedor_nome_completo}}' },
      { id: 'vendedor_cpf_cnpj', label: 'CPF/CNPJ', placeholder: '{{vendedor_cpf_cnpj}}' },
      { id: 'vendedor_rg', label: 'RG', placeholder: '{{vendedor_rg}}' },
      { id: 'vendedor_nacionalidade', label: 'Nacionalidade', placeholder: '{{vendedor_nacionalidade}}' },
      { id: 'vendedor_estado_civil', label: 'Estado civil', placeholder: '{{vendedor_estado_civil}}' },
      { id: 'vendedor_profissao', label: 'Profissão', placeholder: '{{vendedor_profissao}}' },
      { id: 'vendedor_endereco_completo', label: 'Endereço completo', placeholder: '{{vendedor_endereco_completo}}' },
      { id: 'vendedor_email', label: 'E-mail', placeholder: '{{vendedor_email}}' },
      { id: 'vendedor_telefone', label: 'Telefone', placeholder: '{{vendedor_telefone}}' },
    ],
  },
  {
    id: 'comprador',
    nome: 'Comprador',
    icone: 'Users',
    campos: [
      { id: 'comprador_nome_completo', label: 'Nome completo', placeholder: '{{comprador_nome_completo}}' },
      { id: 'comprador_cpf_cnpj', label: 'CPF/CNPJ', placeholder: '{{comprador_cpf_cnpj}}' },
      { id: 'comprador_rg', label: 'RG', placeholder: '{{comprador_rg}}' },
      { id: 'comprador_nacionalidade', label: 'Nacionalidade', placeholder: '{{comprador_nacionalidade}}' },
      { id: 'comprador_estado_civil', label: 'Estado civil', placeholder: '{{comprador_estado_civil}}' },
      { id: 'comprador_profissao', label: 'Profissão', placeholder: '{{comprador_profissao}}' },
      { id: 'comprador_endereco_completo', label: 'Endereço completo', placeholder: '{{comprador_endereco_completo}}' },
      { id: 'comprador_email', label: 'E-mail', placeholder: '{{comprador_email}}' },
      { id: 'comprador_telefone', label: 'Telefone', placeholder: '{{comprador_telefone}}' },
    ],
  },
  {
    id: 'imovel_venda',
    nome: 'Imóvel',
    icone: 'Home',
    campos: [
      { id: 'imovel_tipo', label: 'Tipo do imóvel', placeholder: '{{imovel_tipo}}' },
      { id: 'imovel_endereco_completo', label: 'Endereço completo', placeholder: '{{imovel_endereco_completo}}' },
      { id: 'imovel_matricula', label: 'Matrícula', placeholder: '{{imovel_matricula}}' },
      { id: 'imovel_area_privativa', label: 'Área privativa', placeholder: '{{imovel_area_privativa}}' },
      { id: 'imovel_vagas', label: 'Vagas de garagem', placeholder: '{{imovel_vagas}}' },
      { id: 'imovel_cidade', label: 'Cidade', placeholder: '{{imovel_cidade}}' },
      { id: 'imovel_uf', label: 'UF', placeholder: '{{imovel_uf}}' },
    ],
  },
  {
    id: 'financeiro_venda',
    nome: 'Valores e pagamentos',
    icone: 'DollarSign',
    campos: [
      { id: 'contrato_valor_venda', label: 'Valor da venda', placeholder: '{{contrato_valor_venda}}' },
      { id: 'contrato_valor_venda_extenso', label: 'Valor da venda por extenso', placeholder: '{{contrato_valor_venda_extenso}}' },
      { id: 'contrato_valor_sinal', label: 'Valor do sinal', placeholder: '{{contrato_valor_sinal}}' },
      { id: 'contrato_valor_financiado', label: 'Valor financiado', placeholder: '{{contrato_valor_financiado}}' },
      { id: 'contrato_percentual_comissao', label: 'Comissão (%)', placeholder: '{{contrato_percentual_comissao}}' },
      { id: 'contrato_valor_comissao', label: 'Valor da comissão', placeholder: '{{contrato_valor_comissao}}' },
      { id: 'contrato_multa_inadimplencia', label: 'Multa por inadimplência', placeholder: '{{contrato_multa_inadimplencia}}' },
    ],
  },
  {
    id: 'geral_venda',
    nome: 'Informações gerais',
    icone: 'MoreHorizontal',
    campos: [
      { id: 'data_atual_extenso', label: 'Data atual por extenso', placeholder: '{{data_atual_extenso}}' },
      { id: 'nome_imobiliaria', label: 'Nome da imobiliária', placeholder: '{{nome_imobiliaria}}' },
      { id: 'cnpj_imobiliaria', label: 'CNPJ da imobiliária', placeholder: '{{cnpj_imobiliaria}}' },
      { id: 'creci_imobiliaria', label: 'CRECI da imobiliária', placeholder: '{{creci_imobiliaria}}' },
      { id: 'endereco_imobiliaria', label: 'Endereço da imobiliária', placeholder: '{{endereco_imobiliaria}}' },
    ],
  },
];

export const CAMPOS_DINAMICOS = CAMPOS_DINAMICOS_LOCACAO;

export const getCamposDinamicosByTipo = (tipoContrato: TipoContratoTemplate): GrupoCamposDinamicos[] =>
  tipoContrato === 'venda' ? CAMPOS_DINAMICOS_VENDA : CAMPOS_DINAMICOS_LOCACAO;

export const DADOS_PREVIEW_LOCACAO: Record<string, string> = {
  contrato_codigo: 'LOC-2024-001',
  contrato_data_inicio: '01/03/2024',
  contrato_data_fim: '01/09/2026',
  contrato_duracao_meses: '30',
  contrato_modalidade_pagamento: 'Boleto bancário',
  contrato_indice_reajuste: 'IGP-M',
  contrato_dia_vencimento: '10',
  locador_nome_completo: 'Diogo Rodrigues',
  locador_cpf_cnpj: '123.456.789-00',
  locador_rg: '1234567890',
  locador_nacionalidade: 'Brasileiro',
  locador_estado_civil: 'Casado',
  locador_profissao: 'Engenheiro',
  locador_endereco_completo: 'Rua Appel, 347 - Santa Maria/RS',
  locatario_nome_completo: 'Isadora Bolzan Martins',
  locatario_cpf_cnpj: '987.654.321-00',
  locatario_rg: '9876543210',
  locatario_nacionalidade: 'Brasileira',
  locatario_estado_civil: 'Solteira',
  locatario_profissao: 'Advogada',
  locatario_endereco_completo: 'Av. Brasil, 500 - Centro, Santa Maria/RS',
  imovel_tipo: 'Apartamento',
  imovel_endereco_completo: 'Rua Serafim Valandro, 1000, Apto 301 - Centro, Santa Maria/RS',
  imovel_matricula: '12345',
  imovel_descricao_resumida: '2 dormitórios, 1 banheiro, 1 vaga de garagem',
  imovel_cidade: 'Santa Maria',
  imovel_uf: 'RS',
  contrato_valor_aluguel: 'R$ 1.500,00',
  contrato_valor_aluguel_extenso: 'mil e quinhentos reais',
  contrato_valor_condominio: 'R$ 350,00',
  contrato_valor_iptu: 'R$ 150,00',
  contrato_taxa_administracao_percentual: '10%',
  contrato_multa_percentual: '10%',
  contrato_juros_percentual: '1%',
  data_atual_extenso: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
  nome_imobiliaria: 'Hunter Imóveis',
  cnpj_imobiliaria: '12.345.678/0001-90',
  creci_imobiliaria: 'CRECI-RS 12345-J',
  endereco_imobiliaria: 'Av. Principal, 1500 - Centro, Santa Maria/RS',
};

export const DADOS_PREVIEW_VENDA: Record<string, string> = {
  contrato_codigo: 'VEN-2024-019',
  contrato_data_assinatura: '15/05/2024',
  contrato_prazo_escritura_dias: '90',
  contrato_forma_pagamento: 'Sinal + financiamento bancário',
  contrato_indice_correcao: 'IPCA',
  vendedor_nome_completo: 'Carlos Eduardo Souza',
  vendedor_cpf_cnpj: '111.222.333-44',
  vendedor_rg: '405060708',
  vendedor_nacionalidade: 'Brasileiro',
  vendedor_estado_civil: 'Casado',
  vendedor_profissao: 'Empresário',
  vendedor_endereco_completo: 'Rua Borges de Medeiros, 900 - Centro, Santa Maria/RS',
  comprador_nome_completo: 'Marina Fernandes Lima',
  comprador_cpf_cnpj: '999.888.777-66',
  comprador_rg: '909090909',
  comprador_nacionalidade: 'Brasileira',
  comprador_estado_civil: 'Solteira',
  comprador_profissao: 'Médica',
  comprador_endereco_completo: 'Av. Presidente Vargas, 1200 - Centro, Santa Maria/RS',
  imovel_tipo: 'Apartamento',
  imovel_endereco_completo: 'Rua Marechal Floriano, 455, Apto 702 - Centro, Santa Maria/RS',
  imovel_matricula: 'M-554433',
  imovel_area_privativa: '98m²',
  imovel_vagas: '2',
  imovel_cidade: 'Santa Maria',
  imovel_uf: 'RS',
  contrato_valor_venda: 'R$ 780.000,00',
  contrato_valor_venda_extenso: 'setecentos e oitenta mil reais',
  contrato_valor_sinal: 'R$ 78.000,00',
  contrato_valor_financiado: 'R$ 702.000,00',
  contrato_percentual_comissao: '5%',
  contrato_valor_comissao: 'R$ 39.000,00',
  contrato_multa_inadimplencia: '2% sobre a parcela em atraso',
  data_atual_extenso: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
  nome_imobiliaria: 'Hunter Imóveis',
  cnpj_imobiliaria: '12.345.678/0001-90',
  creci_imobiliaria: 'CRECI-RS 12345-J',
  endereco_imobiliaria: 'Av. Principal, 1500 - Centro, Santa Maria/RS',
};

export const DADOS_PREVIEW = DADOS_PREVIEW_LOCACAO;

export const getDadosPreviewByTipo = (tipoContrato: TipoContratoTemplate): Record<string, string> =>
  tipoContrato === 'venda' ? DADOS_PREVIEW_VENDA : DADOS_PREVIEW_LOCACAO;

export const TEMPLATE_PADRAO_LOCACAO = `
<p style="text-align: center;"><strong>CONTRATO DE LOCAÇÃO RESIDENCIAL</strong></p>
<p style="text-align: center;">Contrato nº <span class="placeholder" data-placeholder="{{contrato_codigo}}">{{contrato_codigo}}</span></p>
<p><strong>1. PARTES</strong></p>
<p><strong>LOCADOR:</strong> <span class="placeholder" data-placeholder="{{locador_nome_completo}}">{{locador_nome_completo}}</span>, CPF <span class="placeholder" data-placeholder="{{locador_cpf_cnpj}}">{{locador_cpf_cnpj}}</span>, residente em <span class="placeholder" data-placeholder="{{locador_endereco_completo}}">{{locador_endereco_completo}}</span>.</p>
<p><strong>LOCATÁRIO:</strong> <span class="placeholder" data-placeholder="{{locatario_nome_completo}}">{{locatario_nome_completo}}</span>, CPF <span class="placeholder" data-placeholder="{{locatario_cpf_cnpj}}">{{locatario_cpf_cnpj}}</span>, residente em <span class="placeholder" data-placeholder="{{locatario_endereco_completo}}">{{locatario_endereco_completo}}</span>.</p>
<p><strong>2. OBJETO</strong></p>
<p>Locação do imóvel <span class="placeholder" data-placeholder="{{imovel_tipo}}">{{imovel_tipo}}</span>, situado em <span class="placeholder" data-placeholder="{{imovel_endereco_completo}}">{{imovel_endereco_completo}}</span>, matrícula <span class="placeholder" data-placeholder="{{imovel_matricula}}">{{imovel_matricula}}</span>.</p>
<p><strong>3. PRAZO E VALOR</strong></p>
<p>Prazo de <span class="placeholder" data-placeholder="{{contrato_duracao_meses}}">{{contrato_duracao_meses}}</span> meses, de <span class="placeholder" data-placeholder="{{contrato_data_inicio}}">{{contrato_data_inicio}}</span> até <span class="placeholder" data-placeholder="{{contrato_data_fim}}">{{contrato_data_fim}}</span>. Aluguel mensal de <span class="placeholder" data-placeholder="{{contrato_valor_aluguel}}">{{contrato_valor_aluguel}}</span>, vencimento no dia <span class="placeholder" data-placeholder="{{contrato_dia_vencimento}}">{{contrato_dia_vencimento}}</span>.</p>
<p><strong>4. FORO</strong></p>
<p>Fica eleito o foro de <span class="placeholder" data-placeholder="{{imovel_cidade}}">{{imovel_cidade}}</span>/<span class="placeholder" data-placeholder="{{imovel_uf}}">{{imovel_uf}}</span>.</p>
`;

export const TEMPLATE_PADRAO_VENDA = `
<p style="text-align: center;"><strong>CONTRATO PARTICULAR DE COMPRA E VENDA DE IMÓVEL</strong></p>
<p style="text-align: center;">Contrato nº <span class="placeholder" data-placeholder="{{contrato_codigo}}">{{contrato_codigo}}</span></p>
<p><strong>CLÁUSULA 1ª - DAS PARTES</strong></p>
<p><strong>1.1 VENDEDOR(A):</strong> <span class="placeholder" data-placeholder="{{vendedor_nome_completo}}">{{vendedor_nome_completo}}</span>, CPF/CNPJ <span class="placeholder" data-placeholder="{{vendedor_cpf_cnpj}}">{{vendedor_cpf_cnpj}}</span>, RG <span class="placeholder" data-placeholder="{{vendedor_rg}}">{{vendedor_rg}}</span>, residente em <span class="placeholder" data-placeholder="{{vendedor_endereco_completo}}">{{vendedor_endereco_completo}}</span>.</p>
<p><strong>1.2 COMPRADOR(A):</strong> <span class="placeholder" data-placeholder="{{comprador_nome_completo}}">{{comprador_nome_completo}}</span>, CPF/CNPJ <span class="placeholder" data-placeholder="{{comprador_cpf_cnpj}}">{{comprador_cpf_cnpj}}</span>, RG <span class="placeholder" data-placeholder="{{comprador_rg}}">{{comprador_rg}}</span>, residente em <span class="placeholder" data-placeholder="{{comprador_endereco_completo}}">{{comprador_endereco_completo}}</span>.</p>
<p><strong>CLÁUSULA 2ª - DO OBJETO</strong></p>
<p>O VENDEDOR promete vender ao COMPRADOR o imóvel <span class="placeholder" data-placeholder="{{imovel_tipo}}">{{imovel_tipo}}</span>, situado em <span class="placeholder" data-placeholder="{{imovel_endereco_completo}}">{{imovel_endereco_completo}}</span>, matrícula nº <span class="placeholder" data-placeholder="{{imovel_matricula}}">{{imovel_matricula}}</span>, com área privativa de <span class="placeholder" data-placeholder="{{imovel_area_privativa}}">{{imovel_area_privativa}}</span> e <span class="placeholder" data-placeholder="{{imovel_vagas}}">{{imovel_vagas}}</span> vaga(s) de garagem.</p>
<p><strong>CLÁUSULA 3ª - DO PREÇO E FORMA DE PAGAMENTO</strong></p>
<p>O preço certo e ajustado é de <span class="placeholder" data-placeholder="{{contrato_valor_venda}}">{{contrato_valor_venda}}</span> (<span class="placeholder" data-placeholder="{{contrato_valor_venda_extenso}}">{{contrato_valor_venda_extenso}}</span>), pagos da seguinte forma: sinal de <span class="placeholder" data-placeholder="{{contrato_valor_sinal}}">{{contrato_valor_sinal}}</span> e saldo de <span class="placeholder" data-placeholder="{{contrato_valor_financiado}}">{{contrato_valor_financiado}}</span> via <span class="placeholder" data-placeholder="{{contrato_forma_pagamento}}">{{contrato_forma_pagamento}}</span>.</p>
<p><strong>CLÁUSULA 4ª - ESCRITURA E TRANSFERÊNCIA</strong></p>
<p>A escritura definitiva será outorgada no prazo de até <span class="placeholder" data-placeholder="{{contrato_prazo_escritura_dias}}">{{contrato_prazo_escritura_dias}}</span> dias, contado da assinatura em <span class="placeholder" data-placeholder="{{contrato_data_assinatura}}">{{contrato_data_assinatura}}</span>, observada a atualização monetária pelo índice <span class="placeholder" data-placeholder="{{contrato_indice_correcao}}">{{contrato_indice_correcao}}</span>.</p>
<p><strong>CLÁUSULA 5ª - COMISSÃO DE INTERMEDIAÇÃO</strong></p>
<p>A comissão devida à imobiliária <span class="placeholder" data-placeholder="{{nome_imobiliaria}}">{{nome_imobiliaria}}</span> será de <span class="placeholder" data-placeholder="{{contrato_percentual_comissao}}">{{contrato_percentual_comissao}}</span>, equivalente a <span class="placeholder" data-placeholder="{{contrato_valor_comissao}}">{{contrato_valor_comissao}}</span>.</p>
<p><strong>CLÁUSULA 6ª - INADIMPLEMENTO</strong></p>
<p>O inadimplemento de qualquer obrigação pecuniária sujeitará a parte inadimplente à multa de <span class="placeholder" data-placeholder="{{contrato_multa_inadimplencia}}">{{contrato_multa_inadimplencia}}</span>, sem prejuízo de perdas e danos.</p>
<p><strong>CLÁUSULA 7ª - FORO</strong></p>
<p>As partes elegem o foro de <span class="placeholder" data-placeholder="{{imovel_cidade}}">{{imovel_cidade}}</span>/<span class="placeholder" data-placeholder="{{imovel_uf}}">{{imovel_uf}}</span>.</p>
<p><strong>ASSINATURAS</strong></p>
<p>Local e data: <span class="placeholder" data-placeholder="{{imovel_cidade}}">{{imovel_cidade}}</span>, <span class="placeholder" data-placeholder="{{data_atual_extenso}}">{{data_atual_extenso}}</span>.</p>
<p style="text-align: center;">_____________________________________________</p>
<p style="text-align: center;"><strong>VENDEDOR(A):</strong> <span class="placeholder" data-placeholder="{{vendedor_nome_completo}}">{{vendedor_nome_completo}}</span></p>
<p style="text-align: center;">_____________________________________________</p>
<p style="text-align: center;"><strong>COMPRADOR(A):</strong> <span class="placeholder" data-placeholder="{{comprador_nome_completo}}">{{comprador_nome_completo}}</span></p>
`;

export function mergePlaceholders(template: string, dados: Record<string, string>): string {
  let resultado = template;

  Object.entries(dados).forEach(([key, value]) => {
    const regex = new RegExp(`<span[^>]*data-placeholder="\\{\\{${key}\\}\\}"[^>]*>\\{\\{${key}\\}\\}</span>`, 'g');
    resultado = resultado.replace(regex, value);

    const simpleRegex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    resultado = resultado.replace(simpleRegex, value);
  });

  return resultado;
}

export function extractPlaceholders(template: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = template.matchAll(regex);
  const placeholders = new Set<string>();

  for (const match of matches) {
    placeholders.add(match[1]);
  }

  return Array.from(placeholders);
}
