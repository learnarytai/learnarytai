import { createClient } from '@/lib/supabase/server'
import { openrouter } from '@/lib/openrouter'
import { NextRequest, NextResponse } from 'next/server'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

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

  const prompt = `You are a professional translator and language teacher.

Translate the following text from ${sourceLang} to ${targetLang}.

For EACH word in the translated text, provide:
1. The translated word
2. Its part of speech (noun, verb, adjective, adverb, pronoun, numeral, preposition, conjunction, particle, interjection, participle, gerund)
3. A brief explanation of grammar rules and usage
4. The corresponding original word

Return ONLY valid JSON (no markdown, no code blocks):
{
  "translatedText": "full translated text",
  "words": [
    {
      "id": "w1",
      "original": "word in source language",
      "translation": "word in target language",
      "pos": "noun",
      "explanation": "Explanation of grammar...",
      "position": { "start": 0, "end": 5 }
    }
  ]
}

Text to translate:
${text}`

  try {
    const completion = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 })
    }

    // Clean the response - remove markdown code blocks if present
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const result = JSON.parse(cleaned)

    // Update character count
    await supabase
      .from('profiles')
      .update({ characters_used: profile.characters_used + charCount })
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
