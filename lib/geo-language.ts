const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  // Ukraine
  UA: 'uk',
  // CIS → Russian
  RU: 'ru',
  BY: 'ru',
  KZ: 'ru',
  KG: 'ru',
  TJ: 'ru',
  UZ: 'ru',
  TM: 'ru',
  MD: 'ru',
  AM: 'ru',
  AZ: 'ru',
  GE: 'ru',
  // Italy
  IT: 'it',
  // Spain + Latin America
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  // France
  FR: 'fr',
  BE: 'fr',
  CH: 'fr',
}

const SUPPORTED_LANGUAGES = new Set(['uk', 'en', 'ru', 'es', 'it', 'fr'])

export function getLanguageByCountry(countryCode: string | undefined): string {
  if (!countryCode) return 'en'
  return COUNTRY_TO_LANGUAGE[countryCode.toUpperCase()] || 'en'
}

export function getLanguageByAcceptHeader(acceptLanguage: string): string {
  // Parse Accept-Language header: "uk-UA,uk;q=0.9,en;q=0.8"
  const langs = acceptLanguage
    .split(',')
    .map((part) => {
      const [lang, q] = part.trim().split(';q=')
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { lang } of langs) {
    // Try exact match first (e.g. "uk")
    if (SUPPORTED_LANGUAGES.has(lang)) return lang
    // Try base language from locale (e.g. "uk" from "uk-UA")
    const base = lang.split('-')[0]
    if (SUPPORTED_LANGUAGES.has(base)) return base
  }

  return 'en'
}
