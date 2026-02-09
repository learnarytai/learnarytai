import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/supabase/ensure-profile'
import { getAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

// Fast translation via Google Translate
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

    // Fast translation (Google → MyMemory fallback)
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

    // Update character count (non-blocking)
    getAdminClient()
      .from('profiles')
      .update({
        characters_used: profile.characters_used + charCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .then(() => {})
      .catch((err: unknown) => console.error('[Translate] Char count update failed:', err))

    return NextResponse.json({
      translatedText,
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
