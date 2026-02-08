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

  const handleMouseOver = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      const wordId = target.dataset?.wordId
      if (wordId) {
        onWordHover(wordId, e)
      }
    },
    [onWordHover]
  )

  const handleMouseLeave = useCallback(() => {
    onWordHover(null)
  }, [onWordHover])

  if (mode === 'input') {
    return (
      <div className="a4-sheet relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[24cm] outline-none"
          onInput={handleInput}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          data-placeholder={placeholder}
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        />
        {!text && (
          <div className="pointer-events-none absolute left-[2cm] top-[2cm] text-muted-foreground/50">
            {placeholder}
          </div>
        )}
      </div>
    )
  }

  // Output mode - render with part-of-speech highlighting
  const renderHighlightedText = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Translating...
        </div>
      )
    }

    if (!text) {
      return (
        <span className="text-muted-foreground/50">Translation will appear here...</span>
      )
    }

    if (parsedWords.length === 0) {
      return <span>{text}</span>
    }

    // Build highlighted output from parsed words
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
    <div className="a4-sheet" onMouseLeave={handleMouseLeave}>
      <div className="min-h-[24cm]" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {renderHighlightedText()}
      </div>
    </div>
  )
}
