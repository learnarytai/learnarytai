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

export function getLanguageByCountry(countryCode: string | undefined): string {
  if (!countryCode) return 'en'
  return COUNTRY_TO_LANGUAGE[countryCode.toUpperCase()] || 'en'
}
