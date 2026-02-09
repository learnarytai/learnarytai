import { createClient } from '@/lib/supabase/server'
import { openrouter } from '@/lib/openrouter'
import { NextRequest, NextResponse } from 'next/server'

const ANALYSIS_SYSTEM = `You are a language teacher. You receive a source text and its translation.
Your job: analyze EVERY word in the translated text.

For each word provide:
- id: "w1", "w2", ... (sequential)
- original: the corresponding word(s) from the source text
- translation: the word in the translated text (include attached punctuation)
- pos: part of speech (noun, adjective, verb, adverb, pronoun, numeral, preposition, conjunction, particle, interjection, participle, gerund)
- explanation: detailed grammatical explanation in the TARGET language. Include:
  * Why this translation/form is used
  * Conjugation/declension details
  * Gender, number, case (if applicable)
  * Agreement rules

CRITICAL: Return ONLY valid JSON. No markdown. No code blocks. No thinking tags.
Format: { "words": [{ "id": "w1", "original": "...", "translation": "...", "pos": "noun", "explanation": "..." }, ...] }`

export async function POST(request: NextRequest) {
  try {
    const { sourceText, translatedText, sourceLang, targetLang } = await request.json()

    if (!sourceText?.trim() || !translatedText?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Auth check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userPrompt = `Source (${sourceLang}): "${sourceText}"
Translation (${targetLang}): "${translatedText}"

Analyze EVERY word in the translation. Return JSON with "words" array.`

    const completion = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'tngtech/deepseek-r1t2-chimera:free',
      messages: [
        { role: 'system', content: ANALYSIS_SYSTEM },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content || ''

    // Clean response
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
    const words = (parsed.words || []).map((w: Record<string, unknown>, i: number) => ({
      id: w.id || `w${i + 1}`,
      original: w.original || '',
      translation: w.translation || '',
      pos: w.pos || 'noun',
      explanation: w.explanation || '',
    }))

    return NextResponse.json({ words })
  } catch (err) {
    console.error('[Analyze] Error:', err)
    return NextResponse.json({ words: [] })
  }
}
