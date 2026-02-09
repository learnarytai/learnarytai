'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/use-translation'
import { useDictionary } from '@/hooks/use-dictionary'
import { useGeoLanguage } from '@/hooks/use-geo-language'
import { useLanguage } from '@/components/providers/language-provider'
import { useProfile } from '@/components/providers/profile-provider'
import type { ParsedWord } from '@/lib/types'
import { LanguageSelector } from './language-selector'
import { TextEditor } from './text-editor'
import { WordTooltip } from './word-tooltip'
import { toast } from 'sonner'
import { ArrowLeftRight } from 'lucide-react'

const SESSION_KEY = 'translator-source-text'
const SESSION_SRC_LANG = 'translator-src-lang'
const SESSION_TGT_LANG = 'translator-tgt-lang'

export function TranslationArea() {
  const geoLang = useGeoLanguage()
  const { t } = useLanguage()
  const { profile } = useProfile()

  const [sourceText, setSourceText] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(SESSION_KEY) || ''
    }
    return ''
  })
  const [sourceLang, setSourceLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(SESSION_SRC_LANG) || 'en'
    }
    return 'en'
  })
  const [targetLang, setTargetLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(SESSION_TGT_LANG) || 'uk'
    }
    return 'uk'
  })
  const [langInitialized, setLangInitialized] = useState(false)
  const [hoveredWordId, setHoveredWordId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(true)
  const [langNotification, setLangNotification] = useState<string | null>(null)
  const [tooltipData, setTooltipData] = useState<{
    word: ParsedWord
    position: { x: number; y: number }
  } | null>(null)

  // Track whether we already handled a particular detectedLang
  const lastHandledDetection = useRef<string | null>(null)

  // Geo language init (only if no saved preference)
  useEffect(() => {
    if (!langInitialized && geoLang !== 'en') {
      const hasSaved =
        typeof window !== 'undefined' && sessionStorage.getItem(SESSION_SRC_LANG)
      if (!hasSaved) {
        setSourceLang(geoLang)
        setTargetLang('en')
      }
      setLangInitialized(true)
    }
  }, [geoLang, langInitialized])

  // Persist to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, sourceText)
  }, [sourceText])

  useEffect(() => {
    sessionStorage.setItem(SESSION_SRC_LANG, sourceLang)
  }, [sourceLang])

  useEffect(() => {
    sessionStorage.setItem(SESSION_TGT_LANG, targetLang)
  }, [targetLang])

  const { translatedText, parsedWords, isLoading, error, detectedLang } =
    useTranslation(sourceText, sourceLang, targetLang)
  const { addEntry } = useDictionary()

  // Auto-detect language: if API detected a different language, update selectors
  useEffect(() => {
    if (
      detectedLang &&
      detectedLang !== sourceLang &&
      detectedLang !== lastHandledDetection.current
    ) {
      lastHandledDetection.current = detectedLang

      if (detectedLang === targetLang) {
        // User types in target language - swap
        setSourceLang(targetLang)
        setTargetLang(sourceLang)
      } else {
        setSourceLang(detectedLang)
      }

      setLangNotification(detectedLang)
      const timer = setTimeout(() => setLangNotification(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [detectedLang, sourceLang, targetLang])

  // Reset detection tracking when user manually changes source text
  const handleSourceTextChange = useCallback((text: string) => {
    setSourceText(text)
    setIsEditing(true)
    lastHandledDetection.current = null
  }, [])

  const hasTranslation = parsedWords.length > 0 && !isLoading
  const hasPlainTranslation = translatedText.length > 0 && !isLoading
  const sourceMode = (hasTranslation || hasPlainTranslation) && !isEditing ? 'source' : 'input'

  // Switch to source mode when translation completes
  useEffect(() => {
    if (hasPlainTranslation) {
      setIsEditing(false)
    }
  }, [hasPlainTranslation])

  const handleSwapLanguages = useCallback(() => {
    const newSrc = targetLang
    const newTgt = sourceLang
    setSourceLang(newSrc)
    setTargetLang(newTgt)
    setSourceText(translatedText)
    setIsEditing(true)
    lastHandledDetection.current = null
  }, [sourceLang, targetLang, translatedText])

  const handleEditRequest = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleWordHover = useCallback(
    (wordId: string | null, event?: React.MouseEvent) => {
      setHoveredWordId(wordId)
      if (wordId && event) {
        const word = parsedWords.find((w) => w.id === wordId)
        if (word) {
          const rect = (event.target as HTMLElement).getBoundingClientRect()
          setTooltipData({
            word,
            position: { x: rect.left, y: rect.bottom },
          })
        }
      } else {
        setTooltipData(null)
      }
    },
    [parsedWords]
  )

  const handleAddToDictionary = useCallback(
    async (word: ParsedWord) => {
      const success = await addEntry({
        source_word: word.original,
        translation: word.translation,
        part_of_speech: word.pos,
        explanation: word.explanation,
        source_lang: sourceLang,
        target_lang: targetLang,
        example_sentence: null,
      })
      if (success) {
        toast.success(`"${word.original}" ${t('dictionary.added')}`)
      } else {
        toast.error(t('dictionary.failedAdd'))
      }
      setTooltipData(null)
    },
    [addEntry, sourceLang, targetLang, t]
  )

  const charLimit = profile?.characters_limit ?? 1000
  const tier = profile?.subscription_tier ?? 'free'

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      {error && (
        <div className="mx-auto mb-3 max-w-md rounded-xl bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden px-2">
        {/* Left panel - Source */}
        <div className="flex flex-1 flex-col">
          <div className="relative mb-3 flex items-center justify-center">
            <LanguageSelector value={sourceLang} onChange={setSourceLang} />
            {/* Language auto-detect notification */}
            {langNotification && (
              <span className="absolute right-0 animate-pulse text-xs text-primary">
                {t(`lang.${langNotification}`)}
              </span>
            )}
          </div>
          <div className="a4-sheet relative flex-1 overflow-y-auto">
            <TextEditor
              mode={sourceMode}
              text={sourceText}
              parsedWords={parsedWords}
              hoveredWordId={hoveredWordId}
              placeholder={t('translator.inputPlaceholder')}
              onChange={handleSourceTextChange}
              onWordHover={handleWordHover}
              onEditRequest={handleEditRequest}
            />
            {/* Character counter - bottom right */}
            <div className="pointer-events-none absolute bottom-2 right-3 select-none text-xs text-muted-foreground/50">
              {tier === 'pro'
                ? sourceText.length.toLocaleString()
                : `${sourceText.length.toLocaleString()} / ${charLimit.toLocaleString()}`}
            </div>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex items-center">
          <button
            onClick={handleSwapLanguages}
            className="rounded-full border bg-background p-2 shadow-sm transition-colors hover:bg-muted"
          >
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Right panel - Translation */}
        <div className="flex flex-1 flex-col">
          <div className="mb-3 flex justify-center">
            <LanguageSelector value={targetLang} onChange={setTargetLang} />
          </div>
          <div className="a4-sheet flex-1 overflow-y-auto">
            <TextEditor
              mode="output"
              text={translatedText}
              parsedWords={parsedWords}
              hoveredWordId={hoveredWordId}
              isLoading={isLoading}
              onWordHover={handleWordHover}
            />
          </div>
        </div>
      </div>

      {tooltipData && (
        <WordTooltip
          word={tooltipData.word}
          position={tooltipData.position}
          onAddToDictionary={handleAddToDictionary}
        />
      )}
    </div>
  )
}
