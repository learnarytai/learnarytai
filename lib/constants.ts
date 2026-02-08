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
  { code: 'en', name: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'ru', name: 'Russian', flag: '\u{1F1F7}\u{1F1FA}' },
  { code: 'es', name: 'Spanish', flag: '\u{1F1EA}\u{1F1F8}' },
  { code: 'fr', name: 'French', flag: '\u{1F1EB}\u{1F1F7}' },
  { code: 'de', name: 'German', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'it', name: 'Italian', flag: '\u{1F1EE}\u{1F1F9}' },
  { code: 'pt', name: 'Portuguese', flag: '\u{1F1F5}\u{1F1F9}' },
  { code: 'zh', name: 'Chinese', flag: '\u{1F1E8}\u{1F1F3}' },
  { code: 'ja', name: 'Japanese', flag: '\u{1F1EF}\u{1F1F5}' },
  { code: 'ko', name: 'Korean', flag: '\u{1F1F0}\u{1F1F7}' },
] as const

export const UI_LANGUAGES = [
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
