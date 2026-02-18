import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { EMAIL_CONTACT } from '@/shared/constants';

import { TypographyH1, TypographyMuted, TypographySmall } from '@/shared/components/ui/typography';
import { Progress } from '@/shared/components/ui/progress';
import { Logo } from '@/shared/components/layout/logo';

interface HeaderProps {
  progressValue: number;
}

export function Header({ progressValue }: HeaderProps) {
  const progressLabel = useMemo(() => {
    const percent = Math.round(progressValue);
    return `${percent}% concluído`;
  }, [progressValue]);

  return (
    <header className="space-y-4 text-center md:text-left">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link to="/">
            <Logo width={120} />
          </Link>

          <div>
            <TypographySmall className="text-primary uppercase">Onboarding</TypographySmall>
            <TypographyH1 className="text-center text-3xl md:text-left">Crie seu cadastro no Hunter</TypographyH1>
            <TypographyMuted>
              Preencha as etapas abaixo para ativar sua conta, convidar sua equipe e acessar todos os recursos do
              Hunter.
            </TypographyMuted>
          </div>
        </div>

        <div className="hidden rounded-lg border bg-muted/40 gap-1 p-2 text-left md:flex flex-col">
          <TypographySmall>Precisa de ajuda?</TypographySmall>
          <TypographyMuted>Entre em contato pelo e-mail {EMAIL_CONTACT}</TypographyMuted>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
          <span>Progresso</span>
          <span>{progressLabel}</span>
        </div>

        <Progress value={progressValue} className="h-2" />
      </div>
    </header>
  );
}
