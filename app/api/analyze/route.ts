import { createClient } from '@/lib/supabase/server'
import { openrouter } from '@/lib/openrouter'
import { NextRequest, NextResponse } from 'next/server'

const VALID_POS = new Set([
  'noun', 'adjective', 'verb', 'adverb', 'pronoun', 'numeral',
  'preposition', 'conjunction', 'particle', 'interjection', 'participle', 'gerund',
])

const UI_LANG_NAMES: Record<string, string> = {
  en: 'English', uk: 'Ukrainian', ru: 'Russian',
  es: 'Spanish', fr: 'French', de: 'German',
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

    const systemPrompt = `Analyze each word in the translated text. For contractions (e.g. I'm, don't, it's), split into separate words.

For each word return:
- id: "w1","w2"...
- original: source word(s)
- translation: translated word
- pos: ONE of: noun, adjective, verb, adverb, pronoun, numeral, preposition, conjunction, particle, interjection, participle, gerund
- grammar: grammatical info (gender, number, case, tense, person)
- definition: short definition of this word
- example: one example sentence using this word

ALL text in grammar, definition, example MUST be in ${uiLangName}.

Return ONLY JSON: {"words":[...]}`

    const userPrompt = `Source (${sourceLang}): "${sourceText}"
Translation (${targetLang}): "${translatedText}"`

    const completion = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'tngtech/deepseek-r1t2-chimera:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content || ''

    let cleaned = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .trim()

    const jsonStart = cleaned.indexOf('{')
    const jsonEnd = cleaned.lastIndexOf('}')
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No JSON found in AI response')
    }
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1)

    const parsed = JSON.parse(cleaned)
    const words = (parsed.words || []).map((w: Record<string, unknown>, i: number) => {
      let pos = String(w.pos || 'noun').toLowerCase().trim()
      // Normalize compound POS like "pronoun+verb" to first valid one
      if (!VALID_POS.has(pos)) {
        const parts = pos.split(/[+\/,\s]+/)
        pos = parts.find((p: string) => VALID_POS.has(p)) || 'noun'
      }
      return {
        id: w.id || `w${i + 1}`,
        original: w.original || '',
        translation: w.translation || '',
        pos,
        grammar: w.grammar || '',
        definition: w.definition || '',
        example: w.example || '',
        explanation: w.explanation || '',
      }
    })

    return NextResponse.json({ words })
  } catch (err) {
    console.error('[Analyze] Error:', err)
    return NextResponse.json({ words: [] })
  }
}
