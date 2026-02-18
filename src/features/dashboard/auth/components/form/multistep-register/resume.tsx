import { UseFormReturn } from 'react-hook-form';

import { RegisterFormType } from '@/shared/types';

import { MultistepRegisterFormData } from '@/features/dashboard/auth/components/form/multistep-register/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || '—'}</span>
    </div>
  );
}

interface ResumeFormProps {
  form: UseFormReturn<MultistepRegisterFormData>;
  onNavigateToStep: (step: RegisterFormType) => void;
  planName: string;
}

export function ResumeForm({ form, onNavigateToStep, planName }: ResumeFormProps) {
  const { accountType, companyAccountInfo, name, userInformation } = form.getValues();

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Revise seus dados</h2>
        <p className="text-sm text-muted-foreground">
          Confira se as informações abaixo estão corretas. Caso precise, volte para editar qualquer etapa antes de
          concluir o cadastro.
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Plano e operação</CardTitle>
              <CardDescription>Resumo das escolhas iniciais.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigateToStep('TIPO')}>
              Editar
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium text-muted-foreground">Tipo de operação</span>
              <span className="font-semibold text-foreground">
                {accountType === 'PF' ? 'Pessoa Física' : 'Empresa'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-medium text-muted-foreground">Plano selecionado</span>
              <span className="font-semibold text-foreground">{planName || 'Não informado'}</span>
            </div>
          </CardContent>
        </Card>

        {accountType === 'MATRIZ' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dados da empresa</CardTitle>
                <CardDescription>Informações fiscais e organização da rede.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigateToStep('EMPRESA')}>
                Editar
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <Row label="Razão social" value={companyAccountInfo.socialReason} />
              <Row label="Nome fantasia" value={name} />
              <Row label="CNPJ" value={companyAccountInfo.federalDocument} />
              <Row label="Inscrição estadual" value={companyAccountInfo.stateRegistration} />
              <Row label="Inscrição municipal" value={companyAccountInfo.municipalRegistration} />
              <Row label="Unidades" value={companyAccountInfo.unitAmount} />
              <Row label="Site" value={companyAccountInfo.website} />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Administrador da conta</CardTitle>
              <CardDescription>Acesso principal e preferências de comunicação.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigateToStep('ADMIN')}>
              Editar
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <Row label="Nome completo" value={userInformation.name} />
            <Row label="Telefone" value={userInformation.phone} />
            <Row label="Cargo" value={userInformation.ocupation} />
            <Row label="Receber materiais" value={userInformation.marketingTermsAccepted ? 'Sim' : 'Não'} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
