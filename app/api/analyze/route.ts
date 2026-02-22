import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { openrouter } from '@/lib/openrouter'
import { NextRequest, NextResponse } from 'next/server'

// Allow longer execution on Vercel (default 10s is too short for AI calls)
export const maxDuration = 60

const VALID_POS = new Set([
  'noun', 'adjective', 'verb', 'adverb', 'pronoun', 'numeral',
  'preposition', 'conjunction', 'particle', 'interjection', 'participle', 'gerund',
])

const UI_LANG_NAMES: Record<string, string> = {
  en: 'English', uk: 'Ukrainian', ru: 'Russian',
  it: 'Italian', es: 'Spanish', fr: 'French',
}

// Models to try in order — VERIFIED working IDs from OpenRouter
const MODELS = [
  'z-ai/glm-4.5-air:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'arcee-ai/trinity-large-preview:free',
].filter(Boolean) as string[]

// In-memory cache for analysis results (survives across requests in same serverless instance)
const analysisCache = new Map<string, { words: Record<string, unknown>[]; ts: number }>()
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes
const MAX_CACHE_SIZE = 200

function getCacheKey(translatedText: string, targetLang: string, uiLang: string): string {
  return `${targetLang}:${uiLang}:${translatedText.trim().toLowerCase()}`
}

function getFromCache(key: string): Record<string, unknown>[] | null {
  const entry = analysisCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL) {
    analysisCache.delete(key)
    return null
  }
  return entry.words
}

function setCache(key: string, words: Record<string, unknown>[]) {
  // Evict oldest entries if cache is full
  if (analysisCache.size >= MAX_CACHE_SIZE) {
    const oldest = analysisCache.keys().next().value
    if (oldest) analysisCache.delete(oldest)
  }
  analysisCache.set(key, { words, ts: Date.now() })
}

// --- Supabase DB cache (layer 3: persistent, shared across users) ---

function splitIntoWords(text: string): { raw: string; lower: string }[] {
  return text
    .split(/\s+/)
    .map(w => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter(w => w.length > 0)
    .map(w => ({ raw: w, lower: w.toLowerCase() }))
}

interface CachedWord {
  word_lower: string
  pos: string
  grammar: string
  definition: string
  example: string
}

async function lookupCachedWords(
  wordLowers: string[],
  targetLang: string,
  uiLang: string
): Promise<Map<string, CachedWord> | null> {
  try {
    const admin = getAdminClient()
    const { data, error } = await admin
      .from('word_analysis_cache')
      .select('word_lower, pos, grammar, definition, example')
      .in('word_lower', wordLowers)
      .eq('target_lang', targetLang)
      .eq('ui_lang', uiLang)

    if (error) {
      console.error('[Analyze] DB lookup error:', error.message)
      return null
    }

    const map = new Map<string, CachedWord>()
    for (const row of data ?? []) {
      map.set(row.word_lower, row)
    }
    return map
  } catch (err) {
    console.error('[Analyze] DB lookup failed:', err instanceof Error ? err.message : err)
    return null
  }
}

function storeCachedWords(
  words: Record<string, unknown>[],
  targetLang: string,
  uiLang: string
) {
  try {
    const admin = getAdminClient()
    const payload = words.map(w => ({
      word_lower: String(w.translation || '').toLowerCase(),
      target_lang: targetLang,
      ui_lang: uiLang,
      pos: String(w.pos || 'noun').toLowerCase(),
      grammar: String(w.grammar || ''),
      definition: String(w.definition || ''),
      example: String(w.example || ''),
    })).filter(w => w.word_lower.length > 0)

    if (payload.length === 0) return

    admin.rpc('upsert_word_analyses', { p_words: payload }).then(
      ({ error }: { error: unknown }) => {
        if (error) console.error('[Analyze] DB store error:', error)
        else console.log('[Analyze] Stored', payload.length, 'words to DB cache')
      }
    )
  } catch (err) {
    console.error('[Analyze] DB store failed:', err instanceof Error ? err.message : err)
  }
}

function bumpUsageCount(wordLowers: string[], targetLang: string, uiLang: string) {
  try {
    const admin = getAdminClient()
    admin.rpc('bump_word_usage', {
      p_word_lowers: wordLowers,
      p_target_lang: targetLang,
      p_ui_lang: uiLang,
    }).then(
      ({ error }: { error: unknown }) => {
        if (error) console.error('[Analyze] DB bump error:', error)
      }
    )
  } catch (err) {
    console.error('[Analyze] DB bump failed:', err instanceof Error ? err.message : err)
  }
}

function extractJSON(raw: string): string {
  // Remove think tags (DeepSeek R1 models)
  let cleaned = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim()

  // Find outermost { ... } with brace depth tracking
  let depth = 0
  let start = -1
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] === '{') {
      if (depth === 0) start = i
      depth++
    } else if (cleaned[i] === '}') {
      depth--
      if (depth === 0 && start !== -1) {
        return cleaned.slice(start, i + 1)
      }
    }
  }

  throw new Error('No JSON object found')
}

async function tryAnalyze(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  signal?: AbortSignal
) {
  console.log('[Analyze] Trying model:', model)

  const completion = await openrouter.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  }, { signal })

  const content = completion.choices[0]?.message?.content || ''
  console.log('[Analyze] Response from', model, '- length:', content.length)

  if (!content || content.length < 10) {
    throw new Error(`Empty response from ${model}`)
  }

  const jsonStr = extractJSON(content)
  const parsed = JSON.parse(jsonStr)

  if (!parsed.words || !Array.isArray(parsed.words) || parsed.words.length === 0) {
    throw new Error(`No words in response from ${model}`)
  }

  return parsed.words
}

export async function POST(request: NextRequest) {
  try {
    const { sourceText, translatedText, sourceLang, targetLang, uiLang } = await request.json()

    if (!sourceText?.trim() || !translatedText?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check memory cache first — instant response for repeated queries
    const cacheKey = getCacheKey(translatedText, targetLang, uiLang)
    const cached = getFromCache(cacheKey)
    if (cached) {
      console.log('[Analyze] Memory cache hit for:', translatedText.slice(0, 40))
      const words = cached.map((w, i) => normalizeWord(w, i))
      return NextResponse.json({ words })
    }

    // Check DB cache (Supabase) — shared across all users & instances
    const textWords = splitIntoWords(translatedText)
    const wordLowers = [...new Set(textWords.map(w => w.lower))]

    if (wordLowers.length > 0) {
      const dbCache = await lookupCachedWords(wordLowers, targetLang, uiLang)
      if (dbCache && wordLowers.every(w => dbCache.has(w))) {
        console.log('[Analyze] DB cache hit for:', translatedText.slice(0, 40))

        // Build word list from DB data, preserving original text order
        const sourceWords = splitIntoWords(sourceText)
        const dbWords = textWords.map((tw, i) => {
          const entry = dbCache.get(tw.lower)!
          return {
            id: `w${i + 1}`,
            original: sourceWords[i]?.raw || '',
            translation: tw.raw,
            pos: entry.pos,
            grammar: entry.grammar,
            definition: entry.definition,
            example: entry.example,
          }
        })

        // Store in memory cache too
        setCache(cacheKey, dbWords)
        // Bump usage counts (fire-and-forget)
        bumpUsageCount(wordLowers, targetLang, uiLang)

        const words = dbWords.map((w, i) => normalizeWord(w, i))
        return NextResponse.json({ words })
      }
    }

    const uiLangName = UI_LANG_NAMES[uiLang] || 'English'
    const targetLangName = UI_LANG_NAMES[targetLang] || targetLang
    const sourceLangName = UI_LANG_NAMES[sourceLang] || sourceLang

    const systemPrompt = `You are a professional linguistic analyzer. Return ONLY valid JSON, no other text.

Analyze the translated text word by word. For each word return:
{"words":[{"id":"w1","original":"source word","translation":"translated word","pos":"verb","grammar":"info","definition":"meaning","example":"sentence"}]}

STRICT RULES for pos (part of speech) — pick exactly ONE:
- "noun" — table, cat, idea
- "verb" — run, is, have
- "adjective" — big, red, beautiful
- "adverb" — quickly, very, here, now, always
- "pronoun" — I, he, this, who, nothing, everything
- "numeral" — one, first, 5
- "preposition" — in, on, at, with, from, to, for, about
- "conjunction" — and, but, or, because, that, if, when
- "particle" — not, don't, doesn't, n't, to (before verb)
- "interjection" — oh, wow, hey
- "participle" — running (adj use), broken (adj use)
- "gerund" — swimming (noun use)

IMPORTANT for each word:
- "original": the corresponding word from the SOURCE text (${sourceLangName})
- "translation": the word from the TRANSLATED text (${targetLangName})
- "grammar": grammatical form details (tense, person, number, gender, case etc.) — write in ${uiLangName}
- "definition": brief meaning/explanation of this word — write in ${uiLangName}
- "example": create a NEW, ORIGINAL example sentence using this word in ${targetLangName}. Do NOT copy from the source or translated text. Invent a completely different sentence.
- "id": sequential "w1","w2","w3"...

Match words between source and translation by meaning, not by position.`

    const userPrompt = `Source (${sourceLangName}): "${sourceText}"
Translation (${targetLangName}): "${translatedText}"

Analyze every word in the translation. Return ONLY JSON.`

    // Try each model in order
    let rawWords: Record<string, unknown>[] | null = null
    let lastError = ''

    for (const model of MODELS) {
      try {
        rawWords = await tryAnalyze(model, systemPrompt, userPrompt)
        console.log('[Analyze] Success with', model, '-', rawWords!.length, 'words')
        break
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err)
        console.error('[Analyze] Failed with', model, ':', lastError)
      }
    }

    if (!rawWords) {
      console.error('[Analyze] All models failed. Last error:', lastError)
      return NextResponse.json({ words: [] })
    }

    // Cache the raw result (memory + DB)
    setCache(cacheKey, rawWords)
    storeCachedWords(rawWords, targetLang, uiLang)

    const words = rawWords.map((w, i) => normalizeWord(w, i))

    console.log('[Analyze] Final:', words.map((w: { translation: string; pos: string }) => `${w.translation}(${w.pos})`).join(', '))

    return NextResponse.json({ words })
  } catch (err) {
    console.error('[Analyze] Unexpected error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ words: [] })
  }
}

function normalizeWord(w: Record<string, unknown>, i: number) {
  let pos = String(w.pos || 'noun').toLowerCase().trim()
  if (!VALID_POS.has(pos)) {
    const parts = pos.split(/[+\/,\s]+/)
    pos = parts.find((p: string) => VALID_POS.has(p)) || 'noun'
  }
  return {
    id: w.id || `w${i + 1}`,
    original: String(w.original || ''),
    translation: String(w.translation || ''),
    pos,
    grammar: String(w.grammar || ''),
    definition: String(w.definition || ''),
    example: String(w.example || ''),
    explanation: String(w.explanation || ''),
  }
}
