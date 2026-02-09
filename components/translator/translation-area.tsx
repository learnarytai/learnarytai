'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/use-translation'
import { useDebounce } from '@/hooks/use-debounce'
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
  const { t, locale } = useLanguage()
  const { profile, refreshProfile } = useProfile()

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
  const [tooltipAnchor, setTooltipAnchor] = useState<{
    wordId: string
    position: { x: number; y: number }
  } | null>(null)
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTooltipHoveredRef = useRef(false)

  // Track whether we already handled a particular detectedLang
  const lastHandledDetection = useRef<string | null>(null)

  // Debounce sourceText to know when user stopped typing
  const debouncedSourceText = useDebounce(sourceText, 600)

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

  const { translatedText, parsedWords, isLoading, isAnalyzing, error, detectedLang } =
    useTranslation(sourceText, sourceLang, targetLang, locale)
  const { addEntry } = useDictionary()

  // Refresh profile after translation completes to update characters_used
  const prevTranslatedRef = useRef('')
  useEffect(() => {
    if (translatedText && translatedText !== prevTranslatedRef.current) {
      prevTranslatedRef.current = translatedText
      const timer = setTimeout(() => refreshProfile(), 1000)
      return () => clearTimeout(timer)
    }
  }, [translatedText, refreshProfile])

  // Auto-detect language: if API detected a different language, update selectors
  useEffect(() => {
    if (
      detectedLang &&
      detectedLang !== sourceLang &&
      detectedLang !== lastHandledDetection.current
    ) {
      lastHandledDetection.current = detectedLang

      if (detectedLang === targetLang) {
        setSourceLang(targetLang)
        setTargetLang(sourceLang)
      } else {
        setSourceLang(detectedLang)
      }
    }
  }, [detectedLang, sourceLang, targetLang])

  // Reset detection tracking when user manually changes source text
  const handleSourceTextChange = useCallback((text: string) => {
    setSourceText(text)
    setIsEditing(true)
    lastHandledDetection.current = null
  }, [])

  const hasPlainTranslation = translatedText.length > 0 && !isLoading
  // Only switch to source mode when user STOPPED typing (debounced text matches current)
  const userStoppedTyping = sourceText === debouncedSourceText
  const sourceMode = hasPlainTranslation && !isEditing && userStoppedTyping ? 'source' : 'input'

  // Switch to source mode when translation completes AND user stopped typing
  useEffect(() => {
    if (hasPlainTranslation && userStoppedTyping) {
      setIsEditing(false)
    }
  }, [hasPlainTranslation, userStoppedTyping])

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

  // Derive current tooltip word from parsedWords (always fresh)
  const tooltipWord = tooltipAnchor
    ? parsedWords.find((w) => w.id === tooltipAnchor.wordId) || null
    : null
  const hasAnalysisData = tooltipWord ? !!(tooltipWord.definition || tooltipWord.grammar) : false

  const handleWordHover = useCallback(
    (wordId: string | null, event?: React.MouseEvent) => {
      // Clear any pending hide timeout
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
        tooltipTimeoutRef.current = null
      }

      if (wordId && event) {
        setHoveredWordId(wordId)
        const rect = (event.target as HTMLElement).getBoundingClientRect()
        setTooltipAnchor({
          wordId,
          position: { x: rect.left, y: rect.bottom },
        })
      } else {
        // Delay hiding to allow mouse to move to tooltip
        tooltipTimeoutRef.current = setTimeout(() => {
          if (!isTooltipHoveredRef.current) {
            setHoveredWordId(null)
            setTooltipAnchor(null)
          }
        }, 200)
      }
    },
    []
  )

  const handleTooltipMouseEnter = useCallback(() => {
    isTooltipHoveredRef.current = true
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
      tooltipTimeoutRef.current = null
    }
  }, [])

  const handleTooltipMouseLeave = useCallback(() => {
    isTooltipHoveredRef.current = false
    setHoveredWordId(null)
    setTooltipAnchor(null)
  }, [])

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
      setTooltipAnchor(null)
    },
    [addEntry, sourceLang, targetLang, t]
  )

  const charsUsed = profile?.characters_used ?? 0
  const charLimit = profile?.characters_limit ?? 1000
  const tier = profile?.subscription_tier ?? 'free'
  const limitReached = tier === 'free' && charsUsed >= charLimit

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      {error && (
        <div className="mx-auto mb-3 max-w-md rounded-xl bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {limitReached && (
        <div className="mx-auto mb-3 max-w-md rounded-xl bg-yellow-500/10 px-4 py-2 text-center text-sm text-yellow-700 dark:text-yellow-400">
          {t('translator.limitReached')}
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden px-2">
        {/* Left panel - Source */}
        <div className="flex flex-1 flex-col">
          <div className="mb-3 flex justify-center">
            <LanguageSelector value={sourceLang} onChange={setSourceLang} />
          </div>
          <div className="a4-sheet relative flex-1 overflow-hidden">
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
            {/* Total character usage counter */}
            <div className="pointer-events-none absolute bottom-2 right-3 select-none text-xs text-muted-foreground/50">
              {tier === 'pro'
                ? charsUsed.toLocaleString()
                : `${t('translator.used')}: ${charsUsed.toLocaleString()} / ${charLimit.toLocaleString()}`}
            </div>
          </div>
        </div>

        {/* Center column - Swap button + Analyzing indicator */}
        <div className="flex flex-col items-center">
          {/* Analyzing indicator at language selector level */}
          <div className="mb-3 flex h-8 items-center">
            {isAnalyzing ? (
              <div className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>{t('translator.analyzing')}</span>
              </div>
            ) : null}
          </div>
          {/* Swap button */}
          <div className="flex flex-1 items-start pt-8">
            <button
              onClick={handleSwapLanguages}
              className="rounded-full border bg-background p-2 shadow-sm transition-colors hover:bg-muted"
            >
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Right panel - Translation */}
        <div className="flex flex-1 flex-col">
          <div className="mb-3 flex justify-center">
            <LanguageSelector value={targetLang} onChange={setTargetLang} />
          </div>
          <div className="a4-sheet relative flex-1 overflow-y-auto">
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

      {tooltipWord && tooltipAnchor && hasAnalysisData && (
        <WordTooltip
          word={tooltipWord}
          position={tooltipAnchor.position}
          onAddToDictionary={handleAddToDictionary}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        />
      )}
    </div>
  )
}
