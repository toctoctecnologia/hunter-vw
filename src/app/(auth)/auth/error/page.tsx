import { useSearchParams } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function Page() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Desculpe, algo deu errado.</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap break-words w-full">
                  Código do erro: {error}
                </pre>
              ) : (
                <pre className="text-sm text-muted-foreground">Ocorreu um erro não especificado.</pre>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
