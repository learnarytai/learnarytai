'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from '@/hooks/use-translation'
import { useDictionary } from '@/hooks/use-dictionary'
import { useGeoLanguage } from '@/hooks/use-geo-language'
import { useLanguage } from '@/components/providers/language-provider'
import type { Profile, ParsedWord } from '@/lib/types'
import { LanguageSelector } from './language-selector'
import { TextEditor } from './text-editor'
import { WordTooltip } from './word-tooltip'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ArrowLeftRight, Pencil } from 'lucide-react'

interface TranslationAreaProps {
  profile: Profile | null
}

export function TranslationArea({ profile }: TranslationAreaProps) {
  const geoLang = useGeoLanguage()
  const { t } = useLanguage()
  const [sourceText, setSourceText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('uk')
  const [langInitialized, setLangInitialized] = useState(false)
  const [hoveredWordId, setHoveredWordId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(true)
  const [tooltipData, setTooltipData] = useState<{
    word: ParsedWord
    position: { x: number; y: number }
  } | null>(null)

  useEffect(() => {
    if (!langInitialized && geoLang !== 'en') {
      setSourceLang(geoLang)
      setTargetLang('en')
      setLangInitialized(true)
    }
  }, [geoLang, langInitialized])

  const { translatedText, parsedWords, isLoading, error } = useTranslation(
    sourceText,
    sourceLang,
    targetLang
  )
  const { addEntry } = useDictionary()

  const hasTranslation = parsedWords.length > 0 && !isLoading
  const sourceMode = hasTranslation && !isEditing ? 'source' : 'input'

  const handleSwapLanguages = useCallback(() => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setIsEditing(true)
  }, [sourceLang, targetLang, translatedText])

  const handleSourceTextChange = useCallback((text: string) => {
    setSourceText(text)
    setIsEditing(true)
  }, [])

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

  const charUsed = profile?.characters_used ?? 0
  const charLimit = profile?.characters_limit ?? 1000
  const tier = profile?.subscription_tier ?? 'free'
  const charPercent = tier === 'pro' ? 0 : (charUsed / charLimit) * 100

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col">
      {error && (
        <div className="mx-auto mb-3 max-w-md rounded-xl bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden px-2">
        <div className="flex flex-1 flex-col">
          <div className="mb-3 flex items-center justify-center gap-2">
            <LanguageSelector value={sourceLang} onChange={setSourceLang} />
            {sourceMode === 'source' && (
              <button
                onClick={handleEditRequest}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                title={t('translator.editText')}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="a4-sheet flex-1 overflow-y-auto">
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
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={handleSwapLanguages}
            className="rounded-full border bg-background p-2 shadow-sm transition-colors hover:bg-muted"
          >
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

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

      <div className="sticky bottom-0 mt-3 flex items-center justify-center gap-3 rounded-xl border bg-background/80 px-4 py-2 backdrop-blur-sm">
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              charPercent > 90
                ? 'bg-destructive'
                : charPercent > 70
                  ? 'bg-yellow-500'
                  : 'bg-primary'
            )}
            style={{ width: tier === 'pro' ? '0%' : `${Math.min(charPercent, 100)}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {tier === 'pro'
            ? `${charUsed.toLocaleString()} ${t('translator.characters')} (Pro)`
            : `${charUsed.toLocaleString()} / ${charLimit.toLocaleString()}`}
        </span>
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
