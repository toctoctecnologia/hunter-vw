'use client';
import { CheckCircle } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export default function Page() {
  const handleBackToApp = () => {
    window.location.href = 'hunterapp://';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Conta Confirmada!</h1>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-primary-foreground">
            Sua conta foi confirmada com sucesso. Agora você pode acessar todos os recursos do Hunter CRM.
          </p>
          <Button onClick={handleBackToApp} className="w-full" size="lg">
            Voltar para o App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
