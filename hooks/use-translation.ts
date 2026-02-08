'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from './use-debounce'
import type { TranslationResult, ParsedWord } from '@/lib/types'

export function useTranslation(
  text: string,
  sourceLang: string,
  targetLang: string
) {
  const [translatedText, setTranslatedText] = useState('')
  const [parsedWords, setParsedWords] = useState<ParsedWord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedText = useDebounce(text, 300)

  useEffect(() => {
    if (!debouncedText.trim()) {
      setTranslatedText('')
      setParsedWords([])
      setError(null)
      return
    }

    const controller = new AbortController()

    async function translate() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: debouncedText,
            sourceLang,
            targetLang,
          }),
          signal: controller.signal,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Translation failed')
        }

        const data: TranslationResult = await res.json()
        setTranslatedText(data.translatedText)
        setParsedWords(data.words || [])
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    translate()

    return () => controller.abort()
  }, [debouncedText, sourceLang, targetLang])

  return { translatedText, parsedWords, isLoading, error }
}
