import { RegisterStepItem } from '@/shared/types';

export const REGISTER_STEPS: RegisterStepItem[] = [
  {
    type: 'TIPO',
    title: 'Tipo de operação',
    description: 'Defina se sua operação é pessoa física ou jurídica.',
    summary:
      'Escolher o tipo de operação nos ajuda a configurar automaticamente os recursos e permissões da plataforma Hunter.',
  },
  {
    type: 'PLANO',
    title: 'Plano Hunter',
    description: 'Selecione o plano que melhor atende a sua operação.',
    summary: 'Compare os planos disponíveis e escolha o ciclo de cobrança ideal para sua imobiliária.',
  },
  {
    type: 'EMPRESA',
    title: 'Dados da empresa',
    description: 'Compartilhe as informações da empresa para gerar o contrato.',
    summary: 'Os dados da sua imobiliária garantem o enquadramento fiscal correto e a gestão de filiais.',
  },
  {
    type: 'DADOS',
    title: 'Dados do corretor',
    description: 'Informe os dados da pessoa física responsável pelo cadastro.',
    summary: 'Precisamos validar seus dados para preparar o contrato e habilitar o painel.',
  },
  {
    type: 'ADDRESS',
    title: 'Endereço',
    description: 'Forneça o seu endereço ou o endereço comercial da sua empresa.',
    summary:
      'Um endereço válido é essencial para correspondências oficiais e para a emissão correta de documentos fiscais.',
  },
  {
    type: 'ADMIN',
    title: 'Administrador da conta',
    description: 'Defina quem será o responsável pelo painel Hunter.',
    summary: 'O administrador será o primeiro usuário com acesso total ao Hunter e poderá convidar a equipe.',
  },
  {
    type: 'RESUMO',
    title: 'Resumo e confirmação',
    description: 'Revise todas as informações antes de finalizar.',
    summary: 'Confira os dados, ajuste o que for necessário e finalize o onboarding com segurança.',
  },
];
