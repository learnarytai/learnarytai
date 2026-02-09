'use client'

import { useRef, useEffect, useCallback } from 'react'
import { PART_OF_SPEECH_COLORS } from '@/lib/constants'
import { useLanguage } from '@/components/providers/language-provider'
import type { ParsedWord, PartOfSpeech } from '@/lib/types'

interface TextEditorProps {
  mode: 'input' | 'source' | 'output'
  text: string
  parsedWords?: ParsedWord[]
  hoveredWordId: string | null
  isLoading?: boolean
  isAnalyzing?: boolean
  placeholder?: string
  onChange?: (text: string) => void
  onWordHover: (wordId: string | null, event?: React.MouseEvent) => void
  onEditRequest?: () => void
}

export function TextEditor({
  mode,
  text,
  parsedWords = [],
  hoveredWordId,
  isLoading,
  isAnalyzing,
  placeholder,
  onChange,
  onWordHover,
  onEditRequest,
}: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (mode === 'input' && textareaRef.current) {
      const el = textareaRef.current
      el.focus()
      el.selectionStart = el.value.length
      el.selectionEnd = el.value.length
    }
  }, [mode])

  const handleMouseLeave = useCallback(() => {
    onWordHover(null)
  }, [onWordHover])

  // Input mode - editable textarea
  if (mode === 'input') {
    return (
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-full w-full resize-none bg-transparent outline-none"
        style={{ minHeight: '200px' }}
      />
    )
  }

  // Render word spans (used by both source and output modes)
  const renderWords = (getWordText: (w: ParsedWord) => string, keyPrefix: string) => {
    if (parsedWords.length === 0) {
      // No analysis yet — show plain text as non-interactive spans
      return <span>{text}</span>
    }

    return parsedWords.map((word, i) => {
      const isHovered = hoveredWordId === word.id
      const color = PART_OF_SPEECH_COLORS[word.pos as PartOfSpeech]

      return (
        <span key={`${keyPrefix}-${word.id}`}>
          <span
            data-word-id={word.id}
            className="cursor-pointer rounded px-[1px] transition-colors duration-100"
            style={{
              backgroundColor: isHovered
                ? color
                  ? `${color}50`
                  : 'rgba(255, 255, 0, 0.3)'
                : undefined,
              borderBottom: isHovered
                ? `2px solid ${color || '#FFCC00'}`
                : '2px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.stopPropagation()
              onWordHover(word.id, e)
            }}
            onMouseLeave={(e) => {
              e.stopPropagation()
              onWordHover(null)
            }}
          >
            {getWordText(word)}
          </span>
          {i < parsedWords.length - 1 ? ' ' : ''}
        </span>
      )
    })
  }

  // Source mode - highlighted source words, click to edit
  if (mode === 'source') {
    return (
      <div
        className="h-full cursor-text"
        onMouseLeave={handleMouseLeave}
        onClick={onEditRequest}
      >
        <div
          className="min-h-[200px]"
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        >
          {renderWords((w) => w.original, 'src')}
        </div>
      </div>
    )
  }

  // Output mode
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">{t('translator.translating')}</span>
        </div>
      </div>
    )
  }

  if (!text) {
    return (
      <div className="h-full">
        <div className="min-h-[200px]">
          <span className="text-muted-foreground/40">
            {t('translator.outputPlaceholder')}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full" onMouseLeave={handleMouseLeave}>
      <div
        className="min-h-[200px]"
        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      >
        {renderWords((w) => w.translation, 'tgt')}
      </div>
      {isAnalyzing && (
        <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/40 border-t-primary" />
          <span className="text-sm">{t('translator.analyzing')}</span>
        </div>
      )}
    </div>
  )
}
