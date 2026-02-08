'use client'

export function getGeoLanguage(): string {
  if (typeof document === 'undefined') return 'en'
  const match = document.cookie.match(/(?:^|; )geo-lang=([^;]*)/)
  return match ? match[1] : 'en'
}
