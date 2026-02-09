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

  // Render interactive word spans
  const renderWordSpans = (getWordText: (w: ParsedWord) => string, keyPrefix: string) => {
    return parsedWords.map((word, i) => {
      const wordText = getWordText(word)
      if (!wordText) return null

      const isHovered = hoveredWordId === word.id
      const color = PART_OF_SPEECH_COLORS[word.pos as PartOfSpeech]
      const hasAnalysis = !!word.definition || !!word.grammar

      return (
        <span key={`${keyPrefix}-${word.id}`}>
          <span
            data-word-id={word.id}
            className="cursor-pointer rounded px-[1px]"
            style={{
              backgroundColor: isHovered
                ? color
                  ? `${color}60`
                  : 'rgba(255, 200, 0, 0.35)'
                : undefined,
              borderBottom: isHovered
                ? `2px solid ${color || '#FFCC00'}`
                : '2px solid transparent',
              transition: 'background-color 0.1s, border-color 0.1s',
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
            {wordText}
          </span>
          {i < parsedWords.length - 1 ? ' ' : ''}
        </span>
      )
    })
  }

  // Source mode — always show the full source text (clickable to return to edit)
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
          <span>{text}</span>
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
        {parsedWords.length > 0
          ? renderWordSpans((w) => w.translation, 'tgt')
          : <span>{text}</span>}
      </div>
    </div>
  )
}
