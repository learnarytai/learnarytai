'use client'

const SUPPORTED_LANGUAGES = new Set(['uk', 'en', 'ru', 'es', 'it', 'fr'])

export function getGeoLanguage(): string {
  if (typeof window === 'undefined') return 'en'

  // 1. Try geo-lang cookie (set by middleware)
  const match = document.cookie.match(/(?:^|; )geo-lang=([^;]*)/)
  if (match && match[1] && match[1] !== 'en') return match[1]

  // 2. Fallback: browser navigator.language
  if (navigator.language) {
    const base = navigator.language.split('-')[0].toLowerCase()
    if (SUPPORTED_LANGUAGES.has(base)) return base
  }

  // 3. Fallback: check all browser languages
  if (navigator.languages) {
    for (const lang of navigator.languages) {
      const base = lang.split('-')[0].toLowerCase()
      if (SUPPORTED_LANGUAGES.has(base)) return base
    }
  }

  return match?.[1] || 'en'
}
