import { createClient } from '@/lib/supabase/server'
import { openrouter } from '@/lib/openrouter'
import { NextRequest, NextResponse } from 'next/server'

const VALID_POS = new Set([
  'noun', 'adjective', 'verb', 'adverb', 'pronoun', 'numeral',
  'preposition', 'conjunction', 'particle', 'interjection', 'participle', 'gerund',
])

const UI_LANG_NAMES: Record<string, string> = {
  en: 'English', uk: 'Ukrainian', ru: 'Russian',
  it: 'Italian', es: 'Spanish', fr: 'French',
}

// Models to try in order (non-thinking models work best for JSON)
const MODELS = [
  process.env.OPENROUTER_MODEL,
  'google/gemini-2.5-pro-exp-03-25:free',
  'meta-llama/llama-4-maverick:free',
].filter(Boolean) as string[]

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
    temperature: 0,
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

    const uiLangName = UI_LANG_NAMES[uiLang] || 'English'
    const targetLangName = UI_LANG_NAMES[targetLang] || targetLang

    const systemPrompt = `You are a linguistic analyzer. Return ONLY valid JSON, no other text.

Analyze each word in the translated text. Return JSON:
{"words":[{"id":"w1","original":"source word","translation":"translated word","pos":"verb","grammar":"info","definition":"meaning","example":"sentence"}]}

Rules:
- pos must be ONE of: noun, adjective, verb, adverb, pronoun, numeral, preposition, conjunction, particle, interjection, participle, gerund
- grammar: grammatical info (tense, person, number, gender, case) in ${uiLangName}
- definition: brief meaning in ${uiLangName}
- example: example sentence using this word in ${targetLangName}
- id: sequential "w1","w2","w3"...`

    const userPrompt = `Source (${sourceLang}): "${sourceText}"
Translation (${targetLang}): "${translatedText}"

Return ONLY JSON.`

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

    const words = rawWords.map((w, i) => {
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
    })

    console.log('[Analyze] Final:', words.map((w: { translation: string; pos: string }) => `${w.translation}(${w.pos})`).join(', '))

    return NextResponse.json({ words })
  } catch (err) {
    console.error('[Analyze] Unexpected error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ words: [] })
  }
}
