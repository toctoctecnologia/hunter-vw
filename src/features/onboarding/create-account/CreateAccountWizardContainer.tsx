import { ReactNode, useMemo } from 'react';

import PageContainer from '@/components/ui/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { WizardStepDescriptor } from '@/components/onboarding';

interface CreateAccountWizardContainerProps {
  steps: WizardStepDescriptor[];
  currentStepIndex: number;
  completedStepIds: string[];
  onStepChange: (index: number) => void;
  progressValue: number;
  children: ReactNode;
  headerAside?: ReactNode;
}

export function CreateAccountWizardContainer({
  steps,
  currentStepIndex,
  completedStepIds,
  onStepChange,
  progressValue,
  children,
  headerAside
}: CreateAccountWizardContainerProps) {
  const currentStep = steps[currentStepIndex];

  const progressLabel = useMemo(() => {
    const percent = Math.round(progressValue);
    return `${percent}% concluído`;
  }, [progressValue]);

  return (
    <PageContainer className="py-10">
      <div className="space-y-10">
        <header className="space-y-3 text-center md:text-left">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-4 md:items-start">
              <img
                src="/branding/hunter-logo.svg"
                alt="Logo Hunter"
                className="h-12 w-auto"
                loading="lazy"
              />
              <div className="space-y-2 text-center md:text-left">
                <p className="text-sm font-medium uppercase text-orange-500">Onboarding</p>
                <h1 className="text-3xl font-semibold tracking-tight">Crie seu cadastro no Hunter</h1>
                <p className="text-base text-muted-foreground">
                  Preencha as etapas abaixo para ativar sua conta, convidar sua equipe e acessar todos os recursos do Hunter.
                </p>
              </div>
            </div>
            {headerAside}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
              <span>Progresso</span>
              <span>{progressLabel}</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Etapas</CardTitle>
              <CardDescription>Avance no seu ritmo e revise sempre que precisar.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {steps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isCompleted = completedStepIds.includes(step.id);

                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => onStepChange(index)}
                        className={cn(
                          'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500',
                          isActive
                            ? 'border-orange-500 bg-orange-50/80 text-orange-700 shadow-sm'
                            : 'border-border bg-muted/40 hover:border-orange-200 hover:bg-muted/60'
                        )}
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <span
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold',
                            isActive
                              ? 'border-orange-500 bg-white text-orange-600'
                              : isCompleted
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                              : 'border-muted-foreground/30 bg-white text-muted-foreground'
                          )}
                        >
                          {index + 1}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold leading-tight text-foreground">{step.title}</span>
                          <span className="text-xs text-muted-foreground">{step.description}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader className="space-y-1">
              <CardTitle>{currentStep.title}</CardTitle>
              <CardDescription>{currentStep.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <p className="text-sm leading-relaxed text-muted-foreground">{currentStep.summary}</p>
              <Separator />
              <div className="flex-1">{children}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}


