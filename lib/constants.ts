export const PART_OF_SPEECH_COLORS = {
  noun: '#FFB6C1',
  adjective: '#87CEEB',
  verb: '#98FB98',
  adverb: '#FFD700',
  pronoun: '#DDA0DD',
  numeral: '#F0E68C',
  preposition: '#FFA07A',
  conjunction: '#B0C4DE',
  particle: '#F5DEB3',
  interjection: '#FF69B4',
  participle: '#7FFFD4',
  gerund: '#FFDAB9',
} as const

export const LANGUAGES = [
  { code: 'uk', name: 'Ukrainian' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Russian' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
] as const

export const UI_LANGUAGES = [
  { code: 'uk', name: '\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439' },
  { code: 'es', name: 'Espa\u00F1ol' },
  { code: 'fr', name: 'Fran\u00E7ais' },
  { code: 'de', name: 'Deutsch' },
] as const

export const CHARACTER_LIMITS = {
  free: 1000,
  pro: Infinity,
} as const
