import { StandardLayout } from '@/layouts/StandardLayout';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <StandardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">Métricas e relatórios</p>
          </div>

          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Em Desenvolvimento</h2>
              <p className="text-muted-foreground max-w-md">
                A plataforma de Analytics estará disponível em breve.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </StandardLayout>
  );
}
