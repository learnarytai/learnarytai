'use client'

import { useRef, useCallback } from 'react'
import { PART_OF_SPEECH_COLORS } from '@/lib/constants'
import type { ParsedWord } from '@/lib/types'

interface TextEditorProps {
  mode: 'input' | 'output'
  text: string
  parsedWords?: ParsedWord[]
  hoveredWordId: string | null
  isLoading?: boolean
  placeholder?: string
  onChange?: (text: string) => void
  onWordHover: (wordId: string | null, event?: React.MouseEvent) => void
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
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerText)
    }
  }, [onChange])

  const handleMouseLeave = useCallback(() => {
    onWordHover(null)
  }, [onWordHover])

  if (mode === 'input') {
    return (
      <div className="relative h-full">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="h-full min-h-[200px] outline-none"
          onInput={handleInput}
          style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
        />
        {!text && (
          <div className="pointer-events-none absolute left-0 top-0 select-none text-muted-foreground/40">
            {placeholder}
          </div>
        )}
      </div>
    )
  }

  const renderHighlightedText = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">Translating...</span>
        </div>
      )
    }

    if (!text) {
      return (
        <span className="text-muted-foreground/40">Translation will appear here...</span>
      )
    }

    if (parsedWords.length === 0) {
      return <span>{text}</span>
    }

    return parsedWords.map((word) => {
      const isHovered = hoveredWordId === word.id
      const color = PART_OF_SPEECH_COLORS[word.pos]

      return (
        <span
          key={word.id}
          data-word-id={word.id}
          data-pos={word.pos}
          className="cursor-pointer rounded-sm px-[1px] transition-colors"
          style={{
            backgroundColor: isHovered ? '#FFFF00' : color ? `${color}40` : undefined,
          }}
          onMouseEnter={(e) => onWordHover(word.id, e)}
          onMouseLeave={() => onWordHover(null)}
        >
          {word.translation}{' '}
        </span>
      )
    })
  }

  return (
    <div className="h-full" onMouseLeave={handleMouseLeave}>
      <div className="min-h-[200px]" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {renderHighlightedText()}
      </div>
    </div>
  )
}
