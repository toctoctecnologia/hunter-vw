import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Camera,
  Settings,
  Edit3,
  Bell,
  Palette,
  Globe,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Eye,
  MessageCircle,
  Briefcase,
  Clock,
  Download,
  Upload,
  Lock,
  Key,
  Facebook,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/ui/useIsMobile';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import PageContainer from '@/components/ui/page-container';

const PerfilPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'info' | 'sync'>('info');
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleBack = () => {
    navigate('/');
  };

  const profileData = {
    name: 'Paulo Capelani',
    email: 'paulo@pauloimoveis.com',
    phone: '(47) 97367-3966',
    company: 'Paulo Imóveis',
    role: 'Corretor',
    joinDate: 'Janeiro 2023',
    contractedName: 'Paulo Roberto Capelani',
    document: 'CPF: 123.456.789-00'
  };

  const stats = [
    { label: 'Imóveis Vendidos', value: '47' },
    { label: 'Leads Ativos', value: '23' },
    { label: 'Serviços Solicitados', value: '12' }
  ];

  const renderInfoTab = () => (
    <div className="p-6 md:p-8 space-y-8">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-3">
            <img 
              src="/uploads/49a1c1d9-28f7-4cf0-bb92-8ed0f0db8b52.png" 
              alt="Paulo Capelani"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-2 right-2 p-1.5 bg-[hsl(var(--accent))] text-white rounded-full hover:bg-[hsl(var(--accentHover))] transition-colors">
            <Camera className="w-3 h-3" />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
        <p className="text-gray-600">{profileData.role}</p>
        <p className="text-xs text-gray-500 mt-1">Versão 1.0 TOC TOC CRM</p>
      </div>

      {/* Stats */}
      <div
        className={`mb-6 ${
          isMobile ? 'grid grid-cols-3 gap-4' : 'flex flex-row justify-between gap-8'
        }`}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center justify-center h-28 rounded-2xl border border-gray-200 bg-white shadow-sm ${
              isMobile ? '' : 'flex-1'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-[hsl(var(--accent))]">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Business Information */}
      <div className="w-full p-5 md:p-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <h3 className="font-semibold text-gray-900">Informações do Negócio</h3>

        <div className="space-y-3">
          <Link
            to="/perfil/negocio/empresa"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Nome da Empresa</p>
                <p className="font-medium text-gray-900">{profileData.company}</p>
                <p className="text-xs text-gray-500">{profileData.contractedName}</p>
                <p className="text-xs text-gray-500">{profileData.document}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Contact Information */}
      <div className="w-full p-5 md:p-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <h3 className="font-semibold text-gray-900">Informações de Contato</h3>

        <div className="space-y-3">
          <Link
            to="/perfil/contato/email"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{profileData.email}</p>
              </div>
            </div>
            <Edit3 className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/contato/telefone"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Telefone</p>
                <p className="font-medium text-gray-900">{profileData.phone}</p>
              </div>
            </div>
            <Edit3 className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/contato/whatsapp"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#25D366] rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">WhatsApp Business</p>
                <p className="font-medium text-gray-900">Conectado</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </Link>
        </div>
      </div>

      {/* AI Assistant Settings */}
      <div className="w-full p-5 md:p-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <h3 className="font-semibold text-gray-900">Assistente IA</h3>

        <div className="space-y-3">
          <Link
            to="/perfil/ia/treinamento"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Treinamento Personalizado</p>
                <p className="font-medium text-gray-900">Ativo</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/ia/sugestoes"
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors shadow-sm border border-gray-100 dark:border-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sugestões Automáticas</p>
                <p className="font-medium text-gray-900">Habilitado</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/ia/lembretes"
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors shadow-sm border border-gray-100 dark:border-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Lembretes Inteligentes</p>
                <p className="font-medium text-gray-900">Diário às 9h</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="w-full p-5 md:p-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <h3 className="font-semibold text-gray-900">Privacidade & Segurança</h3>

        <div className="space-y-3">
          <Link
            to="/perfil/seguranca/2fa"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Autenticação 2FA</p>
                <p className="font-medium text-gray-900">Desabilitado</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/seguranca/senha"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Alterar Senha</p>
                <p className="font-medium text-gray-900">Última alteração: 30 dias</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/seguranca/privacidade"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Privacidade dos Dados</p>
                <p className="font-medium text-gray-900">Configurar</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* App Settings */}
      <div className="w-full p-5 md:p-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <h3 className="font-semibold text-gray-900">Configurações do App</h3>

        <div className="space-y-3">
          <Link
            to="/perfil/app/notificacoes"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Notificações</p>
                <p className="font-medium text-gray-900">Todas ativas</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/app/tema"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Tema</p>
                <p className="font-medium text-gray-900">Claro</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/app/idioma"
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors shadow-sm border border-gray-100 dark:border-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Idioma</p>
                <p className="font-medium text-gray-900">Português (BR)</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Data Management */}
      <div className="w-full p-5 md:p-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <h3 className="font-semibold text-gray-900">Gerenciamento de Dados</h3>

        <div className="space-y-3">
          <Link
            to="/perfil/dados/exportar"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Exportar Dados</p>
                <p className="font-medium text-gray-900">Baixar relatório completo</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/dados/importar"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Importar Contatos</p>
                <p className="font-medium text-gray-900">Do CRM ou planilha</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Support & Help */}
      <div className="w-full p-5 md:p-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 space-y-4">
        <h3 className="font-semibold text-gray-900">Suporte & Ajuda</h3>

        <div className="space-y-3">
          <Link
            to="/perfil/suporte/ajuda"
            className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Central de Ajuda</p>
                <p className="font-medium text-gray-900">FAQ e tutoriais</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/suporte/chat"
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors shadow-sm border border-gray-100 dark:border-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#25D366] rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Contatar Suporte</p>
                <p className="font-medium text-gray-900">Chat ao vivo</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link
            to="/perfil/suporte/termos"
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors shadow-sm border border-gray-100 dark:border-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[hsl(var(--accent))] rounded-2xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Termos de Uso</p>
                <p className="font-medium text-gray-900">Versão 2.1</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full py-4 px-4 bg-[hsl(var(--accent))] text-white rounded-2xl font-semibold hover:bg-[hsl(var(--accentHover))] transition-colors flex items-center justify-center shadow-lg">
          <Settings className="w-5 h-5 mr-2" />
          Configurações Avançadas
        </button>

        <button className="w-full py-4 px-4 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center border border-red-200">
          <LogOut className="w-5 h-5 mr-2" />
          Sair da Conta
        </button>
      </div>
    </div>
  );

  const renderSyncTab = () => (
    <div className="p-6 md:p-8 space-y-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Sincronização</h3>
        <p className="text-gray-600">Conecte seus calendários para sincronizar eventos</p>
      </div>
      
      {/* Google Calendar and Apple Calendar Sync */}
      <div className="space-y-4">
        <Link
          to="/perfil/sync/google-calendar"
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#4285F4] rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-lg">Google Agenda</p>
              <p className="text-gray-500">Sincronizar com Google Calendar</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-[hsl(var(--accent))] text-white rounded-full text-sm font-medium">
            Configurar
          </div>
        </Link>

        <Link
          to="/perfil/sync/apple-calendar"
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-lg">Apple Calendar</p>
              <p className="text-gray-500">Sincronizar com Calendário Apple</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-[hsl(var(--accent))] text-white rounded-full text-sm font-medium">
            Configurar
          </div>
        </Link>

        <Link
          to="/perfil/sync/meta-leads"
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#0866FF] rounded-xl flex items-center justify-center shadow-sm">
              <Facebook className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-lg">Meta Leads</p>
              <p className="text-gray-500">Sincronizar com Facebook/Instagram</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-[hsl(var(--accent))] text-white rounded-full text-sm font-medium">
            Configurar
          </div>
        </Link>

        <Link
          to="/perfil/sync/google-ads-leads"
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#FABB05] rounded-xl flex items-center justify-center shadow-sm">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-lg">Google Ads Leads</p>
              <p className="text-gray-500">Sincronizar com Google Ads</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-[hsl(var(--accent))] text-white rounded-full text-sm font-medium">
            Configurar
          </div>
        </Link>
      </div>

      {/* WhatsApp Sync Status */}
      <Link
        to="/perfil/sync/whatsapp-control"
        className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-gray-300 transition-all"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">WhatsApp</p>
              <p className="text-sm text-gray-500">conectado</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-3 h-3 bg-[#25D366] rounded-full mb-1"></div>
            <p className="text-xs text-gray-500">Ativo</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm text-gray-600">Próxima atualização:</span>
          </div>
          <p className="text-sm font-medium text-gray-900">Jun. 27 • Manhã</p>
        </div>
      </Link>

      {/* Sync Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Sincronização automática</p>
            <p className="text-sm text-gray-500">Atualizar dados automaticamente</p>
          </div>
          <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Notificações de sync</p>
            <p className="text-sm text-gray-500">Receber avisos de sincronização</p>
          </div>
          <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
        </div>
      </div>

      <button className="w-full mt-6 py-4 px-4 bg-[hsl(var(--accent))] text-white rounded-full font-semibold hover:bg-[hsl(var(--accentHover))] transition-colors text-lg">
        Sincronizar Agora
      </button>
    </div>
  );

  

  return (
    <PageContainer>
      <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white dark:bg-neutral-900">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Perfil</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white dark:bg-neutral-900">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'info'
                ? 'text-[hsl(var(--accent))] border-b-2 border-[hsl(var(--accent))]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'sync'
                ? 'text-[hsl(var(--accent))] border-b-2 border-[hsl(var(--accent))]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sincronização
          </button>
        </div>

        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'sync' && renderSyncTab()}
      </div>
    </PageContainer>
  );
};

export default PerfilPage;
