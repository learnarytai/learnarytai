'use client'

import { PART_OF_SPEECH_COLORS } from '@/lib/constants'
import type { ParsedWord } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface WordTooltipProps {
  word: ParsedWord
  position: { x: number; y: number }
  onAddToDictionary: (word: ParsedWord) => void
}

export function WordTooltip({ word, position, onAddToDictionary }: WordTooltipProps) {
  const color = PART_OF_SPEECH_COLORS[word.pos] || '#e5e5e5'

  return (
    <div
      className="fixed z-[100] w-72 rounded-lg border bg-popover p-3 shadow-lg"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 8}px`,
      }}
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-medium">{word.original}</p>
          <p className="text-sm text-muted-foreground">{word.translation}</p>
        </div>
        <Badge
          variant="secondary"
          style={{ backgroundColor: color, color: '#333' }}
          className="text-xs"
        >
          {word.pos}
        </Badge>
      </div>
      {word.explanation && (
        <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
          {word.explanation}
        </p>
      )}
      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={() => onAddToDictionary(word)}
      >
        <Plus className="mr-1 h-3 w-3" />
        Add to Dictionary
      </Button>
    </div>
  )
}
