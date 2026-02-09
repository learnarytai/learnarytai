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
  { code: 'it', name: 'Italian' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
] as const

export const UI_LANGUAGES = [
  { code: 'uk', name: 'Українська' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
] as const

export const CHARACTER_LIMITS = {
  free: 1000,
  pro: Infinity,
} as const
