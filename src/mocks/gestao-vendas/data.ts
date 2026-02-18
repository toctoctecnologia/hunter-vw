import {
  createCnpj,
  createCpf,
  createEmail,
  createPhone,
  createRandomDate,
  createSeededRandom,
  formatCurrency,
  formatDate,
  sample,
  sampleMany,
} from './faker';

const random = createSeededRandom(420);

const firstNames = [
  'Lara',
  'Mateus',
  'Camila',
  'Rafael',
  'Beatriz',
  'Enzo',
  'Helena',
  'Gabriel',
  'Yasmin',
  'Victor',
  'Priscila',
  'Otávio',
];

const lastNames = [
  'Moura',
  'Santana',
  'Almeida',
  'Figueiredo',
  'Barros',
  'Siqueira',
  'Tavares',
  'Amaral',
  'Rezende',
  'Cunha',
];

const companies = [
  'Horizonte Prime',
  'Atlântico Urbanismo',
  'Vale Azul Empreendimentos',
  'Nexo Construtora',
  'Vértice Desenvolvimento',
  'Estação Nova',
];

const banks = ['Banco Aurora', 'Banco Horizonte', 'Banco Faro', 'Banco Atlântico', 'Banco Lumen'];

const neighborhoods = ['Vila das Flores', 'Centro Leste', 'Jardim Atlântico', 'Parque União', 'Lago Azul'];

const streets = ['Rua das Acácias', 'Avenida Solaris', 'Rua do Mercado', 'Alameda Horizonte', 'Travessa Arco-Íris'];

const developments = ['Residencial Aurora', 'Parque do Sol', 'Viva Horizonte', 'Jardins do Vale', 'Vista da Serra'];

const saleTypes = ['Pronto', 'Na planta', 'Permuta', 'Financiamento'];

const contractStatuses = ['Ativo', 'Em assinatura', 'Em financiamento', 'Em pós-venda', 'Concluído', 'Pendente'];

export const brokers = Array.from({ length: 6 }).map((_, index) => {
  const firstName = sample(random, firstNames);
  const lastName = sample(random, lastNames);
  return {
    id: `broker-${index + 1}`,
    nome: `${firstName} ${lastName}`,
    documento: createCpf(random),
    telefone: createPhone(random),
    email: createEmail(firstName, lastName),
  };
});

export const buyers = Array.from({ length: 8 }).map((_, index) => {
  const firstName = sample(random, firstNames);
  const lastName = sample(random, lastNames);
  return {
    id: `buyer-${index + 1}`,
    nome: `${firstName} ${lastName}`,
    documento: createCpf(random),
    telefone: createPhone(random),
    email: createEmail(firstName, lastName),
  };
});

export const sellers = Array.from({ length: 6 }).map((_, index) => {
  const firstName = sample(random, firstNames);
  const lastName = sample(random, lastNames);
  return {
    id: `seller-${index + 1}`,
    nome: `${firstName} ${lastName}`,
    documento: createCpf(random),
    telefone: createPhone(random),
    email: createEmail(firstName, lastName),
  };
});

export const developmentsMock = Array.from({ length: 5 }).map((_, index) => ({
  id: `dev-${index + 1}`,
  nome: developments[index % developments.length],
  incorporadora: sample(random, companies),
  cnpj: createCnpj(random),
}));

export const properties = Array.from({ length: 10 }).map((_, index) => {
  const bairro = sample(random, neighborhoods);
  const rua = sample(random, streets);
  return {
    id: `prop-${index + 1}`,
    tipo: sample(random, ['Apartamento', 'Casa', 'Loft', 'Cobertura']),
    codigo: `IMV-${700 + index}`,
    endereco: `${rua}, ${100 + index} - ${bairro}`,
    empreendimento: sample(random, developments),
    incorporadora: sample(random, companies),
    valor: formatCurrency(420000 + index * 55000),
  };
});

export const saleContracts = Array.from({ length: 8 }).map((_, index) => {
  const comprador = sample(random, buyers);
  const vendedor = sample(random, sellers);
  const corretor = sample(random, brokers);
  const imovel = sample(random, properties);
  const assinatura = createRandomDate(random, -20);
  const conclusao = createRandomDate(random, 20);
  return {
    id: `sale-${index + 1}`,
    codigo: `VEN-${1200 + index}`,
    imovel,
    compradorId: comprador.id,
    vendedorId: vendedor.id,
    corretorId: corretor.id,
    status: sample(random, contractStatuses),
    tipoVenda: sample(random, saleTypes),
    bancoFinanciamento: sample(random, banks),
    dataAssinatura: formatDate(assinatura),
    dataConclusao: formatDate(conclusao),
    valorVenda: imovel.valor,
    entrada: formatCurrency(80000 + index * 5000),
    financiamento: formatCurrency(320000 + index * 40000),
  };
});

export const saleChecklistItems = saleContracts.flatMap((contract) => {
  const baseItems = [
    'Documentos do comprador (RG, CPF, renda, endereço)',
    'Certidões negativas principais',
    'Matrícula atualizada do imóvel',
    'Guia e comprovante de ITBI',
    'Contrato assinado por todas as partes',
    'Comprovante de pagamento da entrada',
    'Registro em cartório concluído',
  ];
  const extraItems = contract.tipoVenda === 'Na planta'
    ? ['Minuta e assinatura da escritura', 'Vistoria técnica do empreendimento']
    : contract.tipoVenda === 'Financiamento'
      ? ['Aprovação do financiamento', 'Documentos do banco']
      : ['Entrega de chaves e termo'];
  const allItems = [...baseItems, ...extraItems];
  return allItems.map((titulo, index) => ({
    id: `${contract.id}-check-${index + 1}`,
    sourceType: 'SaleContract',
    sourceId: contract.id,
    titulo,
    status: sample(random, ['Pendente', 'Em andamento', 'Concluído', 'Bloqueado']),
    exigeAnexo: random() > 0.6,
    responsavel: sample(random, brokers).nome,
    prazo: formatDate(createRandomDate(random, 10)),
  }));
});

export const saleDocuments = saleContracts.flatMap((contract, index) => {
  const docs = [
    { categoria: 'Contratos e aditivos', nome: 'Contrato de venda assinado.pdf' },
    { categoria: 'Certidões', nome: 'Certidões negativas.pdf' },
    { categoria: 'Matrícula e ônus', nome: 'Matrícula atualizada.pdf' },
    { categoria: 'Comprovantes de pagamento', nome: 'Comprovante de entrada.pdf' },
    { categoria: 'Documentos do financiamento', nome: 'Carta de crédito.pdf' },
    { categoria: 'Documentos de cartório', nome: 'Protocolo de registro.pdf' },
    { categoria: 'Documentos do condomínio e transferências', nome: 'Termo de entrega de chaves.pdf' },
  ];
  return docs.map((doc, docIndex) => ({
    id: `${contract.id}-doc-${docIndex + 1}`,
    contratoId: contract.id,
    nome: doc.nome,
    categoria: doc.categoria,
    tags: sampleMany(random, ['original', 'digitalizado', 'assinatura', 'cartório', 'banco'], 2),
    atualizadoEm: formatDate(createRandomDate(random, -5)),
    status: sample(random, ['Validado', 'Em análise', 'Expirado']),
  }));
});

export const saleReceipts = saleContracts.map((contract, index) => ({
  id: `rec-${index + 1}`,
  contrato: contract.codigo,
  cliente: buyers.find((buyer) => buyer.id === contract.compradorId)?.nome ?? 'Cliente Demo',
  status: sample(random, ['Pago', 'A vencer', 'Vencido']),
  formaPagamento: sample(random, ['Pix', 'TED', 'Boleto', 'Cartão']),
  valor: formatCurrency(12000 + index * 3500),
  vencimento: formatDate(createRandomDate(random, 5)),
  dataPagamento: formatDate(createRandomDate(random, -2)),
}));

export const saleCommissions = saleContracts.map((contract, index) => ({
  id: `com-${index + 1}`,
  contrato: contract.codigo,
  corretor: brokers.find((broker) => broker.id === contract.corretorId)?.nome ?? 'Corretor Demo',
  percentual: `${4 + (index % 2)}%`,
  valorBruto: formatCurrency(22000 + index * 2500),
  retencoes: formatCurrency(1800 + index * 200),
  valorLiquido: formatCurrency(20200 + index * 2300),
  status: sample(random, ['Prevista', 'Liberada', 'Paga', 'Retida']),
  dataPrevista: formatDate(createRandomDate(random, 15)),
  dataPaga: formatDate(createRandomDate(random, -7)),
}));

export const saleTransfers = saleContracts.map((contract, index) => ({
  id: `trans-${index + 1}`,
  contrato: contract.codigo,
  tarefa: sample(random, [
    'Transferência de titularidade no condomínio',
    'Transferência de água',
    'Transferência de energia',
    'Transferência de IPTU',
    'Atualização de cadastro do condomínio',
    'Entrega de chaves e termo',
  ]),
  status: sample(random, ['Pendente', 'Em andamento', 'Concluída', 'Atrasada']),
  responsavel: sample(random, brokers).nome,
  dataPrevista: formatDate(createRandomDate(random, 7)),
  dataConclusao: formatDate(createRandomDate(random, -1)),
  anexos: `${1 + (index % 3)} anexos`,
}));

export const saleEvents = saleContracts.map((contract, index) => ({
  id: `event-${index + 1}`,
  contrato: contract.codigo,
  titulo: sample(random, [
    'Agendamento de assinatura',
    'Reunião com banco',
    'Entrega de documentos',
    'Prazo de ITBI',
    'Registro em cartório',
    'Vistoria e entrega de chaves',
  ]),
  data: formatDate(createRandomDate(random, index - 3)),
  horario: `${9 + (index % 5)}:00`,
  responsavel: sample(random, brokers).nome,
  status: sample(random, ['Previsto', 'Confirmado', 'Concluído', 'Cancelado']),
  origem: sample(random, ['Checklist', 'Agenda', 'Tarefa']),
}));

export const saleNotes = saleContracts.map((contract, index) => ({
  id: `note-${index + 1}`,
  contratoId: contract.id,
  titulo: 'Atualização do processo',
  descricao: 'Contato com cartório atualizado e documentação encaminhada.',
  responsavel: sample(random, brokers).nome,
  data: formatDate(createRandomDate(random, -index)),
}));

export const saleTasks = saleContracts.map((contract, index) => ({
  id: `task-${index + 1}`,
  contratoId: contract.id,
  tarefa: sample(random, [
    'Conferir documentos do comprador',
    'Validar certidões negativas',
    'Confirmar aprovação do financiamento',
    'Agendar assinatura',
    'Coletar comprovantes de pagamento',
  ]),
  responsavel: sample(random, brokers).nome,
  data: formatDate(createRandomDate(random, 3)),
  concluido: random() > 0.5,
}));
