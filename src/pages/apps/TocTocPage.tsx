import { useState } from 'react';
import { MessageSquare, Phone, Send, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StandardLayout } from '@/layouts/StandardLayout';
import TocTocPropertiesSection from '@/features/toctoc/TocTocPropertiesSection';
import TocTocPropertyDetailCard from '@/features/toctoc/components/TocTocPropertyDetailCard';
import TocTocServicePhotosPanel from '@/features/toctoc/components/TocTocServicePhotosPanel';
import TocTocPropertyPhotosPanel from '@/features/toctoc/components/TocTocPropertyPhotosPanel';
import TocTocRecentPhotosPanel from '@/features/toctoc/components/TocTocRecentPhotosPanel';
import TocTocLocationsPanel from '@/features/toctoc/components/TocTocLocationsPanel';
import TocTocPropertyTypesPanel from '@/features/toctoc/components/TocTocPropertyTypesPanel';

export const TocTocPage = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();

  return (
    <StandardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 space-y-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-gray-900">TocToc</h1>
              <p className="text-sm text-gray-600 mt-1">
                Catálogo completo das APIs TocToc para imóveis, fotos e localizações.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Use os cards abaixo para testar os endpoints de imóveis, detalhes, fotos recentes e tipos
              disponíveis.
            </p>
          </div>
          
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">+12% desde ontem</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários Online</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">+8% desde ontem</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
                  <Send className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">+23% desde ontem</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chamadas</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">+5% desde ontem</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <CardTitle>Conversas Recentes</CardTitle>
                <CardDescription>Últimas conversas e interações dos usuários</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 rounded-lg border border-[var(--ui-stroke)] p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary)]">
                        <span className="font-medium text-white">U{i}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--ui-text)]">Usuário {i}</p>
                        <p className="text-sm text-[var(--ui-text-subtle)]">
                          Última mensagem há {i * 5} minutos
                        </p>
                      </div>
                      <div className="text-xs text-[var(--ui-text-subtle)]">{i} mensagens não lidas</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2 space-y-6">
                <TocTocPropertiesSection
                  onSelectProperty={setSelectedPropertyId}
                  selectedPropertyId={selectedPropertyId}
                />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <TocTocServicePhotosPanel />
                  <TocTocPropertyPhotosPanel />
                </div>
                <TocTocRecentPhotosPanel />
              </div>
              <div className="space-y-6">
                <TocTocPropertyDetailCard
                  propertyId={selectedPropertyId}
                  onPropertyIdChange={setSelectedPropertyId}
                />
                <TocTocPropertyTypesPanel />
                <TocTocLocationsPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};
