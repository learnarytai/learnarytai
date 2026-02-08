'use client'

import { useState, useCallback } from 'react'
import { useTranslation } from '@/hooks/use-translation'
import { useDictionary } from '@/hooks/use-dictionary'
import type { Profile, ParsedWord } from '@/lib/types'
import { LanguageSelector } from './language-selector'
import { TextEditor } from './text-editor'
import { WordTooltip } from './word-tooltip'
import { CharacterCounter } from './character-counter'
import { toast } from 'sonner'

interface TranslationAreaProps {
  profile: Profile | null
}

export function TranslationArea({ profile }: TranslationAreaProps) {
  const [sourceText, setSourceText] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('ru')
  const [hoveredWordId, setHoveredWordId] = useState<string | null>(null)
  const [tooltipData, setTooltipData] = useState<{
    word: ParsedWord
    position: { x: number; y: number }
  } | null>(null)

  const { translatedText, parsedWords, isLoading, error } = useTranslation(
    sourceText,
    sourceLang,
    targetLang
  )
  const { addEntry } = useDictionary()

  const handleSwapLanguages = useCallback(() => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
  }, [sourceLang, targetLang, translatedText])

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
        toast.success(`"${word.original}" added to dictionary`)
      } else {
        toast.error('Failed to add word')
      }
      setTooltipData(null)
    },
    [addEntry, sourceLang, targetLang]
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Language selectors */}
      <div className="flex items-center justify-center">
        <LanguageSelector
          sourceLang={sourceLang}
          targetLang={targetLang}
          onSourceChange={setSourceLang}
          onTargetChange={setTargetLang}
          onSwap={handleSwapLanguages}
        />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Two A4 sheets side by side */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Source
          </div>
          <TextEditor
            mode="input"
            text={sourceText}
            hoveredWordId={hoveredWordId}
            placeholder="Type or paste text here..."
            onChange={setSourceText}
            onWordHover={handleWordHover}
          />
          <div className="flex justify-end">
            <CharacterCounter
              current={sourceText.length}
              limit={profile?.characters_limit ?? 1000}
              tier={profile?.subscription_tier ?? 'free'}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Translation
          </div>
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

      {/* Tooltip */}
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
