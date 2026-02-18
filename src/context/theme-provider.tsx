import React from "react"

export type ThemePreference = "claro" | "escuro" | "sistema"
export type ThemeMode = "light" | "dark"

interface ThemeContextValue {
  preference: ThemePreference
  resolvedTheme: ThemeMode
  setTheme: (preference: ThemePreference) => void
  applyTheme: (preference: ThemePreference) => void
}

export const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const THEME_STORAGE_KEY = "themePreference"

const systemPrefersDark = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches

const getStoredPreference = (): ThemePreference => {
  if (typeof window === "undefined") return "sistema"
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === "escuro" || stored === "claro" || stored === "sistema") {
      return stored
    }
  } catch (error) {
    console.warn("Unable to read theme preference", error)
  }
  return "sistema"
}

const resolvePreferenceToMode = (preference: ThemePreference): ThemeMode => {
  if (preference === "sistema") {
    return systemPrefersDark() ? "dark" : "light"
  }
  if (preference === "escuro") return "dark"
  return "light"
}

const applyDocumentTheme = (mode: ThemeMode) => {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.setAttribute("data-theme", mode)
  root.classList.toggle("dark", mode === "dark")
  root.classList.toggle("theme-dark", mode === "dark")
  root.classList.toggle("theme-light", mode === "light")
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = React.useState<ThemePreference>(getStoredPreference)
  const [resolvedTheme, setResolvedTheme] = React.useState<ThemeMode>(() =>
    resolvePreferenceToMode(getStoredPreference()),
  )

  React.useEffect(() => {
    if (preference !== "sistema" || typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      const mode = resolvePreferenceToMode("sistema")
      setResolvedTheme(mode)
      applyDocumentTheme(mode)
    }

    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [preference])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mode = resolvePreferenceToMode(preference)
    setResolvedTheme(mode)
    applyDocumentTheme(mode)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference)
    } catch (error) {
      console.warn("Unable to persist theme preference", error)
    }
  }, [preference])

  const handleThemeChange = React.useCallback(
    (nextPreference: ThemePreference, persist = true) => {
      setPreference(nextPreference)
      const mode = resolvePreferenceToMode(nextPreference)
      applyDocumentTheme(mode)

      if (!persist || typeof fetch === "undefined") return

      fetch("/perfil/tema", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema: nextPreference }),
      }).catch(() => {})
    },
    [],
  )

  const value = React.useMemo(
    () => ({
      preference,
      resolvedTheme,
      setTheme: (nextPreference: ThemePreference) => handleThemeChange(nextPreference, true),
      applyTheme: (nextPreference: ThemePreference) => handleThemeChange(nextPreference, false),
    }),
    [handleThemeChange, preference, resolvedTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
