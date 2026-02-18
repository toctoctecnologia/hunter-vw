import { useEffect, useMemo, useState, type ComponentType } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, FileText, Receipt, Users, Zap } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { flattenNavigationItems, getNavigationItems } from "@/config/navigation"
import { getCurrentUser, canAccessBilling } from "@/utils/auth"

interface GlobalSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SearchItem {
  id: string
  title: string
  subtitle?: string
  category: "Páginas" | "Registros" | "Ações"
  href: string
  icon: ComponentType<{ className?: string }>
  keywords?: string[]
}

const SEARCH_RECENTS_KEY = "searchRecentItems"

const recordItems: SearchItem[] = [
  {
    id: "contrato-1023",
    title: "Contrato #1023",
    subtitle: "Locação · Maria Santos",
    category: "Registros",
    href: "/gestao-locacao/contratos/1023",
    icon: FileText,
    keywords: ["contratos", "locação", "maria"],
  },
  {
    id: "boleto-8841",
    title: "Boleto #8841",
    subtitle: "Vencimento 10/04 · R$ 2.450,00",
    category: "Registros",
    href: "/gestao-locacao/faturas/8841",
    icon: Receipt,
    keywords: ["boletos", "faturas"],
  },
  {
    id: "imovel-552",
    title: "Imóvel Jardim Atlântico",
    subtitle: "Código 552 · 3 quartos",
    category: "Registros",
    href: "/imoveis/552",
    icon: Building2,
    keywords: ["imóveis", "jardim", "atlântico"],
  },
  {
    id: "locatario-98",
    title: "Locatário Maria Duarte",
    subtitle: "Contrato ativo · Avenida Central",
    category: "Registros",
    href: "/usuarios/98",
    icon: Users,
    keywords: ["locatários", "usuarios", "maria"],
  },
]

const actionItems: SearchItem[] = [
  {
    id: "criar-boleto",
    title: "Criar boleto",
    subtitle: "Gerar cobrança de aluguel",
    category: "Ações",
    href: "/gestao-locacao/faturas/nova",
    icon: Receipt,
    keywords: ["boleto", "cobrança"],
  },
  {
    id: "criar-contrato",
    title: "Criar contrato",
    subtitle: "Novo contrato de locação",
    category: "Ações",
    href: "/gestao-locacao/contratos/novo",
    icon: FileText,
    keywords: ["contrato", "locação"],
  },
  {
    id: "novo-imovel",
    title: "Cadastrar imóvel",
    subtitle: "Adicionar novo imóvel",
    category: "Ações",
    href: "/imoveis/novo",
    icon: Building2,
    keywords: ["imóvel", "cadastro"],
  },
  {
    id: "novo-lead",
    title: "Criar lead",
    subtitle: "Adicionar lead manualmente",
    category: "Ações",
    href: "/leads/novo",
    icon: Zap,
    keywords: ["lead", "vendas"],
  },
]

const buildSearchItems = (canSeeBilling: boolean): SearchItem[] => {
  const navItems = flattenNavigationItems(getNavigationItems({ canAccessBilling: canSeeBilling }))
  const pageItems: SearchItem[] = navItems.map(item => ({
    id: `page-${item.id}`,
    title: item.label,
    subtitle: item.path,
    category: "Páginas",
    href: item.path,
    icon: item.icon,
    keywords: [item.group ?? ""],
  }))

  return [...pageItems, ...recordItems, ...actionItems]
}

const filterSearchItems = (items: SearchItem[], query: string) => {
  const normalized = query.trim().toLowerCase()
  if (!normalized || normalized.length < 2) return []
  return items.filter(item => {
    const haystack = [
      item.title,
      item.subtitle ?? "",
      item.category,
      ...(item.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase()
    return haystack.includes(normalized)
  })
}

const updateRecentItems = (item: SearchItem) => {
  if (typeof window === "undefined") return
  try {
    const stored = window.localStorage.getItem(SEARCH_RECENTS_KEY)
    const parsed = stored ? (JSON.parse(stored) as string[]) : []
    const next = [item.id, ...parsed.filter(id => id !== item.id)].slice(0, 6)
    window.localStorage.setItem(SEARCH_RECENTS_KEY, JSON.stringify(next))
  } catch (error) {
    console.warn("Unable to update recent search items", error)
  }
}

export default function GlobalSearchModal({ open, onOpenChange }: GlobalSearchModalProps) {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()
  const [query, setQuery] = useState("")
  const searchItems = useMemo(
    () => buildSearchItems(canAccessBilling(currentUser)),
    [currentUser],
  )
  const filteredItems = useMemo(() => filterSearchItems(searchItems, query), [query, searchItems])

  useEffect(() => {
    if (!open) {
      setQuery("")
    }
  }, [open])

  const groupedItems = useMemo(() => {
    return filteredItems.reduce<Record<string, SearchItem[]>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
  }, [filteredItems])

  const handleSelect = (item: SearchItem) => {
    updateRecentItems(item)
    onOpenChange(false)
    navigate(item.href)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Buscar..."
        value={query}
        onValueChange={setQuery}
        autoFocus
      />
      <CommandList>
        {query.trim().length < 2 ? (
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6 text-sm text-muted-foreground">
              <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              Digite pelo menos 2 caracteres para buscar
              <span className="text-xs text-muted-foreground">
                Pressione <kbd className="rounded border px-1">Esc</kbd> para fechar ou
                <span className="ml-1">
                  <kbd className="rounded border px-1">Ctrl</kbd>/
                  <kbd className="rounded border px-1">⌘</kbd>
                  <kbd className="rounded border px-1">K</kbd>
                </span>
              </span>
            </div>
          </CommandEmpty>
        ) : filteredItems.length === 0 ? (
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        ) : (
          <>
            {Object.entries(groupedItems).map(([category, items], index) => (
              <div key={category}>
                {index > 0 ? <CommandSeparator /> : null}
                <CommandGroup heading={category}>
                  {items.map(item => {
                    const Icon = item.icon
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{item.title}</span>
                            {item.subtitle ? (
                              <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                            ) : null}
                          </div>
                        </div>
                        <CommandShortcut>{item.href}</CommandShortcut>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </div>
            ))}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
