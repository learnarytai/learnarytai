'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useDebounce } from './use-debounce'
import type { ParsedWord } from '@/lib/types'

export function useTranslation(
  text: string,
  sourceLang: string,
  targetLang: string,
  uiLang: string = 'en'
) {
  const [translatedText, setTranslatedText] = useState('')
  const [parsedWords, setParsedWords] = useState<ParsedWord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detectedLang, setDetectedLang] = useState<string | null>(null)

  const debouncedText = useDebounce(text, 500)
  const lastRequestRef = useRef(0)
  const analyzeControllerRef = useRef<AbortController | null>(null)

  // Phase 1: Fast translation
  useEffect(() => {
    if (!debouncedText.trim()) {
      setTranslatedText('')
      setParsedWords([])
      setError(null)
      setDetectedLang(null)
      return
    }

    const requestId = ++lastRequestRef.current
    const controller = new AbortController()

    if (analyzeControllerRef.current) {
      analyzeControllerRef.current.abort()
      analyzeControllerRef.current = null
    }

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

        if (requestId !== lastRequestRef.current) return

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Translation failed')
        }

        const data = await res.json()
        setTranslatedText(data.translatedText)
        setDetectedLang(data.detectedLang || null)

        // Create temp word objects immediately so hover works
        const translatedWords = (data.translatedText as string).split(/\s+/).filter(Boolean)
        const sourceWords = debouncedText.split(/\s+/).filter(Boolean)
        const tempWords: ParsedWord[] = translatedWords.map((w: string, i: number) => ({
          id: `w${i + 1}`,
          original: sourceWords[i] || '',
          translation: w,
          pos: 'noun' as const,
          grammar: '',
          definition: '',
          example: '',
          explanation: '',
        }))
        setParsedWords(tempWords)
        setIsLoading(false)

        // Phase 2: Start analysis in background
        if (data.translatedText) {
          analyzeInBackground(
            requestId,
            debouncedText,
            data.translatedText,
            sourceLang,
            targetLang
          )
        }
      } catch (err) {
        if (requestId !== lastRequestRef.current) return
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
        setIsLoading(false)
      }
    }

    translate()

    return () => controller.abort()
  }, [debouncedText, sourceLang, targetLang])

  const analyzeInBackground = useCallback(
    async (
      requestId: number,
      sourceText: string,
      translated: string,
      srcLang: string,
      tgtLang: string
    ) => {
      const controller = new AbortController()
      analyzeControllerRef.current = controller

      const timeout = setTimeout(() => controller.abort(), 30000)
      setIsAnalyzing(true)

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceText,
            translatedText: translated,
            sourceLang: srcLang,
            targetLang: tgtLang,
            uiLang,
          }),
          signal: controller.signal,
        })

        if (requestId !== lastRequestRef.current) return

        if (res.ok) {
          const data = await res.json()
          if (data.words?.length > 0) {
            setParsedWords(data.words)
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        console.error('[Analysis] failed:', err)
      } finally {
        clearTimeout(timeout)
        if (requestId === lastRequestRef.current) {
          setIsAnalyzing(false)
        }
      }
    },
    [uiLang]
  )

  return { translatedText, parsedWords, isLoading, isAnalyzing, error, detectedLang }
}
