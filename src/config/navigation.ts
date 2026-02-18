import {
  House,
  TrendingUp,
  Calendar,
  Building,
  KeyRound,
  Camera,
  Share2,
  Shuffle,
  Braces,
  FileBarChart2,
  CreditCard,
  FileText,
  Receipt,
  ArrowLeftRight,
  BarChart3,
  Bell,
  Bot,
  Gavel,
  LineChart,
  Handshake,
  type LucideIcon,
} from "lucide-react"
import type { ComponentType, SVGProps } from "react"
import { AccessShieldIcon } from "@/components/icons/AccessShieldIcon"
import { PropertyManagerIcon } from "@/components/icons/PropertyManagerIcon"
import { UsersBadgeIcon } from "@/components/icons/UsersBadgeIcon"

export interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>
  path: string
  group?: string
  permissionKey?: string
  requiresBilling?: boolean
  children?: NavigationItem[]
}

export const navigationItems: NavigationItem[] = [
  { id: "home", label: "Home", icon: House, path: "/", group: "principal" },
  { id: "vendas", label: "Negociações", icon: TrendingUp, path: "/vendas", group: "principal" },
  { id: "agenda", label: "Agenda", icon: Calendar, path: "/agenda", group: "principal" },
  { id: "imoveis", label: "Imóveis", icon: Building, path: "/imoveis", group: "principal" },
  {
    id: "gestao-imoveis",
    label: "Gestão de Imóveis",
    icon: PropertyManagerIcon,
    path: "/gestao-imoveis",
    group: "gestao",
  },
  {
    id: "gestao-locacao",
    label: "Gestão de Aluguéis",
    icon: KeyRound,
    path: "/gestao-locacao",
    group: "gestao",
    children: [
      {
        id: "contratos",
        label: "Contratos de locação",
        icon: FileText,
        path: "/gestao-locacao/contratos",
        group: "gestao",
      },
      {
        id: "faturas",
        label: "Boletos",
        icon: Receipt,
        path: "/gestao-locacao/faturas",
        group: "gestao",
      },
      {
        id: "repasses",
        label: "Transferências",
        icon: ArrowLeftRight,
        path: "/gestao-locacao/repasses",
        group: "gestao",
      },
      {
        id: "analises",
        label: "Dados de locação",
        icon: BarChart3,
        path: "/gestao-locacao/analises",
        group: "gestao",
      },
      {
        id: "regua",
        label: "Agenda de cobrança",
        icon: Bell,
        path: "/gestao-locacao/regua-cobranca",
        group: "gestao",
      },
    ],
  },
  {
    id: "gestao-vendas",
    label: "Gestão de Vendas",
    icon: Handshake,
    path: "/gestao-vendas",
    group: "gestao",
    children: [
      {
        id: "contratos-venda",
        label: "Contratos de venda",
        icon: FileText,
        path: "/gestao-vendas/contratos",
        group: "gestao",
      },
      {
        id: "comissoes-venda",
        label: "Comissões",
        icon: ArrowLeftRight,
        path: "/gestao-vendas/comissoes",
        group: "gestao",
      },
      {
        id: "transferencias-venda",
        label: "Transferências",
        icon: Shuffle,
        path: "/gestao-vendas/transferencias",
        group: "gestao",
      },
      {
        id: "documentos-venda",
        label: "Documentos",
        icon: FileText,
        path: "/gestao-vendas/documentos",
        group: "gestao",
      },
      {
        id: "agenda-venda",
        label: "Agenda da venda",
        icon: Calendar,
        path: "/gestao-vendas/agenda",
        group: "gestao",
      },
    ],
  },
  { id: "gestao-leads", label: "Indicadores de Leads", icon: LineChart, path: "/leads", group: "gestao" },
  { id: "usuarios", label: "Usuários", icon: UsersBadgeIcon, path: "/usuarios", group: "gestao" },
  { id: "distribuicao", label: "Distribuição", icon: Share2, path: "/distribuicao", group: "gestao" },
  { id: "gestao-api", label: "Gestão API", icon: Braces, path: "/gestao-api", group: "gestao" },
  { id: "gestao-roletao", label: "Gestão Roletão", icon: Shuffle, path: "/gestao-roletao", group: "gestao" },
  { id: "gestao-relatorios", label: "Gestão de Relatórios", icon: FileBarChart2, path: "/gestao-relatorios", group: "gestao" },
  { id: "automacoes", label: "Automações", icon: Bot, path: "/automacoes", group: "gestao" },
  { id: "business-rules", label: "Regras de Negócio", icon: Gavel, path: "/regras-de-negocio", group: "gestao" },
  { id: "gestao-acessos", label: "Gestão de acessos", icon: AccessShieldIcon, path: "/gestao-acessos", group: "gestao" },
  {
    id: "gerenciamentodeservicos",
    label: "Gerenciamento de serviços",
    icon: Camera,
    path: "/servicos",
    group: "servicos",
  },
  {
    id: "pagamentos",
    label: "Pagamentos",
    icon: CreditCard,
    path: "/pagamentos",
    group: "financeiro",
    requiresBilling: true,
  },
]

export const getNavigationItems = ({ canAccessBilling }: { canAccessBilling: boolean }) => {
  const filterItems = (items: NavigationItem[]): NavigationItem[] =>
    items
      .filter(item => (item.requiresBilling ? canAccessBilling : true))
      .map(item => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined,
      }))

  return filterItems(navigationItems)
}

export const flattenNavigationItems = (items: NavigationItem[]): NavigationItem[] => {
  const flattened: NavigationItem[] = []
  items.forEach(item => {
    flattened.push(item)
    if (item.children) {
      flattened.push(...flattenNavigationItems(item.children))
    }
  })
  return flattened
}
