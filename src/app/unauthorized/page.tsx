import { useNavigate } from 'react-router-dom';
import { Home, ShieldX } from 'lucide-react';

import { EMAIL_CONTACT } from '@/shared/constants';

import { TypographyH1, TypographyH2, TypographyMuted } from '@/shared/components/ui/typography';
import { Card, CardContent, CardDescription, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export default function Page() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="text-center border-0 shadow-none bg-transparent">
          <CardHeader className="space-y-6 pb-8">
            <div className="mx-auto w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="w-12 h-12 text-destructive" />
            </div>

            <div className="space-y-2">
              <TypographyH1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-muted-foreground">403</TypographyH1>
              <TypographyH2 className="text-2xl sm:text-3xl font-semibold text-foreground">Acesso não autorizado</TypographyH2>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="space-y-4">
              <CardDescription className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Você não tem permissão para acessar esta página.
              </CardDescription>
              <TypographyMuted className="text-sm">
                Caso acredite que deveria ter acesso, entre em contato com o administrador da sua conta ou verifique suas
                permissões.
              </TypographyMuted>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/')}>
                <Home className="w-4 h-4" />
                Voltar para o início
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate(-1 as any)}>
                Voltar à página anterior
              </Button>
            </div>

            <div className="pt-8 border-t border-border">
              <TypographyMuted className="text-xs">
                Se você acredita que isso é um erro, entre em contato conosco em{' '}
                <a href={`mailto:${EMAIL_CONTACT}`} className="text-primary hover:text-primary/80 underline transition-colors">
                  {EMAIL_CONTACT}
                </a>
              </TypographyMuted>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
