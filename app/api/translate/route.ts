import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/supabase/ensure-profile'
import { getAdminClient } from '@/lib/supabase/admin'
import { openrouter } from '@/lib/openrouter'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a professional translator and language teacher specializing in grammar analysis.

Your task is to:
1. Translate text from source language to target language
2. Analyze EVERY word in the translated text
3. Identify the part of speech for each word
4. Provide detailed grammatical explanations
5. Show the connection between source and translated words

CRITICAL RULES:
- Analyze EVERY single word (including articles, prepositions, particles)
- Explanations must be detailed and educational
- Be extremely specific about grammar rules
- Show WHY this specific form/translation is used
- Include conjugation/declension details where relevant
- For verbs: include tense, aspect, conjugation pattern
- For nouns: include gender, case, number, declension type
- For adjectives: include agreement details (gender, number, case)
- For pronouns: include person, case, type (personal/possessive/demonstrative)

Parts of speech you MUST identify:
- noun, adjective, verb, adverb, pronoun, numeral, preposition, conjunction, particle, interjection, participle, gerund

Return ONLY valid JSON. No markdown, no explanations outside JSON.`

export async function POST(request: NextRequest) {
  const { text, sourceLang, targetLang } = await request.json()

  if (!text || !sourceLang || !targetLang) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await ensureProfile(user)

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

  const userPrompt = `Translate the following text from ${sourceLang} to ${targetLang}.

For EACH word in the translated text, provide:
1. "original" - the corresponding word(s) in the source language
2. "translation" - the word in the target language
3. "pos" - part of speech (noun, verb, adjective, adverb, pronoun, numeral, preposition, conjunction, particle, interjection, participle, gerund)
4. "explanation" - detailed grammatical explanation including:
   - Why this translation is used
   - Grammar rules applied
   - Conjugation/declension details (for verbs/nouns)
   - Gender, number, case (if applicable)
   - Any exceptions or special rules

Output format:
{
  "translatedText": "full translated text here",
  "words": [
    {
      "id": "w1",
      "original": "source word",
      "translation": "target word",
      "pos": "noun",
      "explanation": "detailed grammar explanation..."
    }
  ]
}

IMPORTANT: Include EVERY word. Words must be in order. Return ONLY JSON, no code blocks.

Text to translate:
${text}`

  try {
    const completion = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'tngtech/deepseek-r1t2-chimera:free',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })
    }

    // Clean the response - remove markdown code blocks and thinking tags if present
    let cleaned = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .trim()

    // Find the JSON object in the response
    const jsonStart = cleaned.indexOf('{')
    const jsonEnd = cleaned.lastIndexOf('}')
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleaned = cleaned.slice(jsonStart, jsonEnd + 1)
    }

    const result = JSON.parse(cleaned)

    // Ensure all words have IDs
    if (result.words) {
      result.words = result.words.map((word: Record<string, unknown>, i: number) => ({
        ...word,
        id: word.id || `w${i + 1}`,
      }))
    }

    // Update character count (use admin to bypass RLS)
    await getAdminClient()
      .from('profiles')
      .update({
        characters_used: profile.characters_used + charCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    return NextResponse.json(result)
  } catch (err) {
    console.error('Translation error:', err)
    return NextResponse.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    )
  }
}
