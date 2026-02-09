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

function extractJSON(raw: string): string {
  // Remove think tags (DeepSeek R1)
  let cleaned = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim()

  // Find outermost { ... }
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

  // Fallback: simple slice
  const jsonStart = cleaned.indexOf('{')
  const jsonEnd = cleaned.lastIndexOf('}')
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    return cleaned.slice(jsonStart, jsonEnd + 1)
  }

  throw new Error('No JSON object found in response')
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

    const systemPrompt = `You are a linguistic analyzer. Analyze each word in the translated text.

For each word return a JSON object with:
- id: "w1","w2","w3"... sequential
- original: the corresponding source word
- translation: the translated word
- pos: exactly ONE of: noun, adjective, verb, adverb, pronoun, numeral, preposition, conjunction, particle, interjection, participle, gerund
- grammar: grammatical info (gender, number, tense, person, case) in ${uiLangName}
- definition: brief definition in ${uiLangName}
- example: one example sentence using this word in ${targetLangName}

IMPORTANT: Return ONLY valid JSON in this exact format, no other text:
{"words":[{"id":"w1","original":"...","translation":"...","pos":"...","grammar":"...","definition":"...","example":"..."}]}`

    const userPrompt = `Source (${sourceLang}): "${sourceText}"
Translation (${targetLang}): "${translatedText}"`

    console.log('[Analyze] Requesting analysis for:', sourceText.substring(0, 50))

    const completion = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'tngtech/deepseek-r1t2-chimera:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0,
      max_tokens: 3000,
    })

    const content = completion.choices[0]?.message?.content || ''
    console.log('[Analyze] Raw response length:', content.length)

    if (!content) {
      console.error('[Analyze] Empty response from model')
      return NextResponse.json({ words: [] })
    }

    const jsonStr = extractJSON(content)
    console.log('[Analyze] Extracted JSON length:', jsonStr.length)

    const parsed = JSON.parse(jsonStr)
    const words = (parsed.words || []).map((w: Record<string, unknown>, i: number) => {
      let pos = String(w.pos || 'noun').toLowerCase().trim()
      // Normalize compound POS like "pronoun+verb" to first valid one
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

    console.log('[Analyze] Parsed', words.length, 'words. POS:', words.map((w: { pos: string }) => w.pos).join(', '))

    return NextResponse.json({ words })
  } catch (err) {
    console.error('[Analyze] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json({ words: [] })
  }
}
