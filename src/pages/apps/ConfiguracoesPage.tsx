import { StandardLayout } from '@/layouts/StandardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, Bell, Shield, Database, Palette } from 'lucide-react';

export const ConfiguracoesPage = () => {
  return (
    <StandardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
            <p className="text-sm text-gray-600 mt-1">Configurações do sistema e preferências</p>
          </div>
          
          <div className="space-y-6">
        {/* Settings Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Perfil do Usuário</CardTitle>
                  <CardDescription>Informações pessoais e conta</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ui-text-subtle)]">
                Gerencie suas informações pessoais, foto de perfil e dados de contato.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Notificações</CardTitle>
                  <CardDescription>Preferências de notificação</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ui-text-subtle)]">
                Configure quando e como receber notificações por e-mail, SMS e push.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Segurança</CardTitle>
                  <CardDescription>Senha e autenticação</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ui-text-subtle)]">
                Altere sua senha, configure 2FA e gerencie sessões ativas.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Palette className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Aparência</CardTitle>
                  <CardDescription>Tema e personalização</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ui-text-subtle)]">
                Escolha entre tema claro/escuro e personalize a interface.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Database className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Dados e Privacidade</CardTitle>
                  <CardDescription>Controle de dados pessoais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ui-text-subtle)]">
                Exporte, importe ou exclua seus dados pessoais da plataforma.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Sistema</CardTitle>
                  <CardDescription>Configurações avançadas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--ui-text-subtle)]">
                Configurações de integração, API e funcionalidades avançadas.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações Rápidas</CardTitle>
            <CardDescription>
              Ajustes mais utilizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { setting: "Notificações por E-mail", description: "Receber notificações por e-mail", enabled: true },
                { setting: "Tema Escuro", description: "Usar tema escuro na interface", enabled: false },
                { setting: "Notificações Push", description: "Receber notificações push no navegador", enabled: true },
                { setting: "Autenticação de Dois Fatores", description: "Adicionar camada extra de segurança", enabled: false },
                { setting: "Sincronização Automática", description: "Sincronizar dados automaticamente", enabled: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-[var(--ui-stroke)] rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--ui-text)]">{setting.setting}</p>
                    <p className="text-sm text-[var(--ui-text-subtle)]">{setting.description}</p>
                  </div>
                  <div className="flex items-center">
                    <div className={`
                      w-12 h-6 rounded-full p-1 transition-colors cursor-pointer
                      ${setting.enabled ? 'bg-[var(--brand-primary)]' : 'bg-gray-300'}
                    `}>
                      <div className={`
                        w-4 h-4 rounded-full bg-white transition-transform
                        ${setting.enabled ? 'translate-x-6' : 'translate-x-0'}
                      `} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
};