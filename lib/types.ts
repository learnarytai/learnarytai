export type PartOfSpeech =
  | 'noun'
  | 'adjective'
  | 'verb'
  | 'adverb'
  | 'pronoun'
  | 'numeral'
  | 'preposition'
  | 'conjunction'
  | 'particle'
  | 'interjection'
  | 'participle'
  | 'gerund'

export interface ParsedWord {
  id: string
  original: string
  translation: string
  pos: PartOfSpeech
  explanation: string
  position: { start: number; end: number }
}

export interface TranslationResult {
  translatedText: string
  words: ParsedWord[]
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  subscription_tier: 'free' | 'pro'
  characters_used: number
  characters_limit: number
  interface_language: string
  theme: 'light' | 'dark' | 'system'
  created_at: string
  updated_at: string
}

export interface DictionaryEntry {
  id: string
  user_id: string
  source_word: string
  translation: string
  part_of_speech: PartOfSpeech | null
  explanation: string | null
  source_lang: string | null
  target_lang: string | null
  example_sentence: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  lemonsqueezy_id: string | null
  status: string | null
  plan: string
  current_period_end: string | null
  created_at: string
  updated_at: string
}
