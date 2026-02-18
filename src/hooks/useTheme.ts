import * as React from "react"
import { ThemeContext, ThemePreference } from "@/context/theme-provider"

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}

export type { ThemePreference }
