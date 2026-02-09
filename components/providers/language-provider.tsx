'use client'

import { createContext, useContext, useCallback } from 'react'
import { t, type Locale } from '@/lib/i18n'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({
  children,
  locale,
  onLocaleChange,
}: {
  children: React.ReactNode
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}) {
  const translate = useCallback(
    (key: string) => t(locale, key),
    [locale]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale: onLocaleChange, t: translate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
