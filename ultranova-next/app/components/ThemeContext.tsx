'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
    theme: 'dark',
    toggleTheme: () => { },
})

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Hard default to dark mode on initial load as per user requirement
        setTheme('dark')
    }, [])

    useEffect(() => {
        if (!mounted) return
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme, mounted])

    const toggleTheme = () => setTheme((p) => (p === 'dark' ? 'light' : 'dark'))

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
