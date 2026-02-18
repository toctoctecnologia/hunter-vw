import * as React from "react"
import { Laptop, Moon, Sun } from "lucide-react"
import { useTheme, type ThemePreference } from "@/hooks/useTheme"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const options: Array<{ value: ThemePreference; label: string; icon: React.ReactNode }> = [
  { value: "claro", label: "Claro", icon: <Sun className="h-4 w-4" /> },
  { value: "escuro", label: "Escuro", icon: <Moon className="h-4 w-4" /> },
  { value: "sistema", label: "Automático", icon: <Laptop className="h-4 w-4" /> },
]

interface ThemeSwitcherProps {
  /**
   * When true, hides the label in the trigger and keeps only the icon visible.
   * The text appears inside the dropdown (as asked in the new header spec).
   */
  compact?: boolean
  className?: string
}

export function ThemeSwitcher({ compact, className }: ThemeSwitcherProps) {
  const { preference, setTheme, resolvedTheme } = useTheme()
  const selected = React.useMemo(
    () => options.find(option => option.value === preference) ?? options[0],
    [preference],
  )

  return (
    <Select value={preference} onValueChange={value => setTheme(value as ThemePreference)}>
      <SelectTrigger
        aria-label="Selecionar tema"
        className={cn(
          "h-10 rounded-xl border-gray-200 bg-white text-sm font-medium shadow-sm shrink-0",
          compact ? "min-w-[52px] justify-center px-2" : "min-w-[152px] px-3",
          resolvedTheme === "dark" ? "text-gray-50" : "text-gray-700",
          className,
        )}
      >
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-700",
              resolvedTheme === "dark" && "bg-gray-800 text-gray-100",
            )}
            aria-hidden
          >
            {selected.icon}
          </span>
          <span className={cn("text-sm font-medium", compact && "hidden lg:inline")}>{selected.label}</span>
          <span className="sr-only">Tema {selected.label}</span>
        </div>
      </SelectTrigger>
      <SelectContent align="end" className="w-48 rounded-xl">
        {options.map(option => (
          <SelectItem key={option.value} value={option.value} className="flex items-center gap-2">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
              {option.icon}
            </span>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ThemeSwitcher
