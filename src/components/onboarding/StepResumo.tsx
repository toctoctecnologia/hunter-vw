import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { formatCNPJ, formatCPF } from '@/lib/validators/doc';

import type { OnboardingDraft } from './types';

interface StepResumoProps {
  draft: OnboardingDraft;
  isSubmitting: boolean;
  onBack: () => void;
  onEdit: (stepId: string) => void;
  onSubmit: () => void;
}

const accountTypeLabel: Record<NonNullable<OnboardingDraft['accountType']>, string> = {
  pf: 'Pessoa física',
  pj: 'Pessoa jurídica'
};

const planLabel: Record<NonNullable<OnboardingDraft['plan']>, string> = {
  starter: 'Essencial',
  growth: 'Growth',
  scale: 'Scale'
};

export function StepResumo({ draft, isSubmitting, onBack, onEdit, onSubmit }: StepResumoProps) {
  const { accountType, plan, pessoaFisica, pessoaJuridica, admin, billingCycle, marketingOptIn } = draft;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Revise seus dados</h2>
          <p className="text-sm text-muted-foreground">
            Confira se as informações abaixo estão corretas. Caso precise, volte para editar qualquer etapa antes de concluir o cadastro.
          </p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          Voltar
        </Button>
      </div>

      <div className="grid gap-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Plano e operação</CardTitle>
              <CardDescription>Resumo das escolhas iniciais.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit('tipo')}>
              Editar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium text-muted-foreground">Tipo de operação</span>
              <span className="font-semibold text-foreground">
                {accountType ? accountTypeLabel[accountType] : 'Não informado'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium text-muted-foreground">Plano selecionado</span>
              <span className="font-semibold text-foreground">
                {plan ? planLabel[plan] : 'Não informado'} ({billingCycle === 'yearly' ? 'Anual' : 'Mensal'})
              </span>
            </div>
          </CardContent>
        </Card>

        {accountType === 'pf' ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dados do corretor</CardTitle>
                <CardDescription>Informações utilizadas para contrato e acesso.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => onEdit('dados')}>
                Editar
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <Row label="Nome completo" value={pessoaFisica.fullName} />
              <Row label="CPF" value={formatCPF(pessoaFisica.cpf)} />
              <Row label="E-mail" value={pessoaFisica.email} />
              <Row label="Telefone" value={pessoaFisica.phone} />
              <Row label="CRECI" value={pessoaFisica.creci} />
              <Row label="Cidade" value={pessoaFisica.city} />
            </CardContent>
          </Card>
        ) : null}

        {accountType === 'pj' ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dados da empresa</CardTitle>
                <CardDescription>Informações fiscais e organização da rede.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => onEdit('empresa')}>
                Editar
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <Row label="Razão social" value={pessoaJuridica.companyName} />
              <Row label="Nome fantasia" value={pessoaJuridica.tradeName} />
              <Row label="CNPJ" value={formatCNPJ(pessoaJuridica.cnpj)} />
              <Row label="Inscrição estadual" value={pessoaJuridica.stateRegistration} />
              <Row label="Inscrição municipal" value={pessoaJuridica.municipalRegistration} />
              <Row label="Tipo de operação" value={pessoaJuridica.branchType === 'matriz' ? 'Matriz' : 'Filial'} />
              {pessoaJuridica.branchType === 'filial' ? (
                <>
                  <Row label="Matriz responsável" value={pessoaJuridica.parentCompanyName ?? '-'} />
                  <Row
                    label="CNPJ da matriz"
                    value={
                      pessoaJuridica.parentCompanyDocument
                        ? formatCNPJ(pessoaJuridica.parentCompanyDocument)
                        : '-'
                    }
                  />
                </>
              ) : null}
              <Row label="Unidades" value={pessoaJuridica.numberOfUnits} />
              <Row label="Site" value={pessoaJuridica.website || '—'} />
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Administrador da conta</CardTitle>
              <CardDescription>Acesso principal e preferências de comunicação.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit('admin')}>
              Editar
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Row label="Nome completo" value={admin.name} />
            <Row label="E-mail" value={admin.email} />
            <Row label="Telefone" value={admin.phone} />
            <Row label="Cargo" value={admin.role} />
            <Row label="Receber materiais" value={marketingOptIn ? 'Sim' : 'Não'} />
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Ao concluir você receberá um e-mail com as próximas orientações e poderá convidar sua equipe.
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button onClick={onSubmit} size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Concluir cadastro'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface RowProps {
  label: string;
  value: string;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || '—'}</span>
    </div>
  );
}

export default StepResumo;
