import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/supabase/ensure-profile'
import { getAdminClient } from '@/lib/supabase/admin'
import { openrouter } from '@/lib/openrouter'
import { NextRequest, NextResponse } from 'next/server'

// --- Phase 1: Fast translation via Google Translate ---

async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<{ translatedText: string; detectedLang: string }> {
  const sl = sourceLang === 'auto' ? 'auto' : sourceLang
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`

  const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
  if (!res.ok) throw new Error(`Google Translate HTTP ${res.status}`)

  const data = await res.json()
  const translatedText =
    data[0]
      ?.filter((seg: unknown[]) => seg && seg[0])
      .map((seg: unknown[]) => seg[0])
      .join('') || ''
  const detectedLang = data[2] || sourceLang

  return { translatedText, detectedLang }
}

// Fallback: MyMemory
async function translateWithMyMemory(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<{ translatedText: string; detectedLang: string }> {
  const langpair = `${sourceLang}|${targetLang}`
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}&de=support@learnarytai.com`

  const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
  if (!res.ok) throw new Error('MyMemory failed')

  const data = await res.json()
  return {
    translatedText: data.responseData?.translatedText || '',
    detectedLang: sourceLang,
  }
}

// --- Phase 2: Grammar analysis with "Моделька" (DeepSeek) ---

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

async function analyzeWithDeepSeek(
  sourceText: string,
  translatedText: string,
  sourceLang: string,
  targetLang: string
): Promise<{ id: string; original: string; translation: string; pos: string; explanation: string }[]> {
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
  return (parsed.words || []).map((w: Record<string, unknown>, i: number) => ({
    id: w.id || `w${i + 1}`,
    original: w.original || '',
    translation: w.translation || '',
    pos: w.pos || 'noun',
    explanation: w.explanation || '',
  }))
}

// --- Main handler ---

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await request.json()

    if (!text?.trim() || !sourceLang || !targetLang) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Auth
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await ensureProfile(user)

    // Check character limit
    const charCount = text.length
    if (
      profile.subscription_tier === 'free' &&
      profile.characters_used + charCount > profile.characters_limit
    ) {
      return NextResponse.json(
        { error: 'Character limit exceeded. Upgrade to Pro!' },
        { status: 403 }
      )
    }

    // Phase 1: Fast translation (Google → MyMemory fallback)
    let translatedText = ''
    let detectedLang: string = sourceLang

    try {
      const result = await translateWithGoogle(text, 'auto', targetLang)
      translatedText = result.translatedText
      detectedLang = result.detectedLang

      // If user types in the target language, translate the other way
      if (detectedLang === targetLang && detectedLang !== sourceLang) {
        const reverse = await translateWithGoogle(text, 'auto', sourceLang)
        translatedText = reverse.translatedText
      }
    } catch (googleErr) {
      console.error('[Translate] Google failed:', googleErr)
      try {
        const mm = await translateWithMyMemory(text, sourceLang, targetLang)
        translatedText = mm.translatedText
      } catch (mmErr) {
        console.error('[Translate] MyMemory failed:', mmErr)
      }
    }

    // Phase 2: Grammar analysis with Моделька
    let words: { id: string; original: string; translation: string; pos: string; explanation: string }[] = []

    if (translatedText) {
      try {
        words = await analyzeWithDeepSeek(text, translatedText, sourceLang, targetLang)
      } catch (analysisErr) {
        console.error('[Translate] Analysis failed:', analysisErr)
        // Translation still works, just without highlighting
      }
    }

    // Update character count
    try {
      await getAdminClient()
        .from('profiles')
        .update({
          characters_used: profile.characters_used + charCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
    } catch (countErr) {
      console.error('[Translate] Char count update failed:', countErr)
    }

    return NextResponse.json({
      translatedText,
      words,
      detectedLang,
    })
  } catch (err) {
    console.error('[Translate] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    )
  }
}
