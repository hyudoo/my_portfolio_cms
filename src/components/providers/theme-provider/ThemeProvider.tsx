'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

type ThemeContextType = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
})

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext)
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  attribute?: string
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, defaultTheme = 'dark', disableTransitionOnChange }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    typeof window === 'undefined' ? (defaultTheme === 'system' ? 'dark' : (defaultTheme as ResolvedTheme)) : resolveTheme(defaultTheme),
  )

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) setThemeState(stored)
  }, [defaultTheme])

  useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)

    const root = document.documentElement
    if (disableTransitionOnChange) {
      root.classList.add('[&_*]:!transition-none')
      requestAnimationFrame(() => root.classList.remove('[&_*]:!transition-none'))
    }
    root.classList.toggle('dark', resolved === 'dark')
  }, [theme, disableTransitionOnChange])

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem('theme', newTheme)
    setThemeState(newTheme)
  }, [])

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>
}
