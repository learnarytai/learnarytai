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

  // Focus textarea when switching to input mode
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
          {parsedWords.length > 0 ? (
            parsedWords.map((word, i) => {
              const isHovered = hoveredWordId === word.id
              const color = PART_OF_SPEECH_COLORS[word.pos as PartOfSpeech]

              return (
                <span key={`src-${word.id}`}>
                  <span
                    data-word-id={word.id}
                    className="cursor-pointer rounded-sm px-[1px] transition-all duration-150"
                    style={{
                      backgroundColor: isHovered
                        ? '#FFFF00'
                        : color
                          ? `${color}30`
                          : undefined,
                      boxShadow: isHovered ? '0 2px 0 #FFFF00' : undefined,
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
                    {word.original}
                  </span>
                  {i < parsedWords.length - 1 ? ' ' : ''}
                </span>
              )
            })
          ) : (
            <span>{text}</span>
          )}
        </div>
      </div>
    )
  }

  // Output mode - highlighted translated words
  const renderHighlightedText = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">{t('translator.translating')}</span>
        </div>
      )
    }

    if (!text) {
      return (
        <span className="text-muted-foreground/40">
          {t('translator.outputPlaceholder')}
        </span>
      )
    }

    if (parsedWords.length === 0) {
      return <span>{text}</span>
    }

    return parsedWords.map((word, i) => {
      const isHovered = hoveredWordId === word.id
      const color = PART_OF_SPEECH_COLORS[word.pos as PartOfSpeech]

      return (
        <span key={`tgt-${word.id}`}>
          <span
            data-word-id={word.id}
            data-pos={word.pos}
            className="cursor-pointer rounded-sm px-[1px] transition-all duration-150"
            style={{
              backgroundColor: isHovered
                ? '#FFFF00'
                : color
                  ? `${color}40`
                  : undefined,
              boxShadow: isHovered ? '0 2px 0 #FFFF00' : undefined,
            }}
            onMouseEnter={(e) => onWordHover(word.id, e)}
            onMouseLeave={() => onWordHover(null)}
          >
            {word.translation}
          </span>
          {i < parsedWords.length - 1 ? ' ' : ''}
        </span>
      )
    })
  }

  return (
    <div className="h-full" onMouseLeave={handleMouseLeave}>
      <div
        className="min-h-[200px]"
        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      >
        {renderHighlightedText()}
      </div>
    </div>
  )
}
