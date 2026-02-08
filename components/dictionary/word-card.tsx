'use client'

import { PART_OF_SPEECH_COLORS } from '@/lib/constants'
import type { DictionaryEntry } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

interface WordCardProps {
  entry: DictionaryEntry
  onDelete: (id: string) => void
}

export function WordCard({ entry, onDelete }: WordCardProps) {
  const color = entry.part_of_speech
    ? PART_OF_SPEECH_COLORS[entry.part_of_speech]
    : undefined

  return (
    <Card className="flex items-start gap-3 p-4">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{entry.source_word}</span>
          <span className="text-muted-foreground">-</span>
          <span className="text-muted-foreground">{entry.translation}</span>
          {entry.part_of_speech && (
            <Badge
              variant="secondary"
              className="text-xs"
              style={{ backgroundColor: color ? `${color}60` : undefined }}
            >
              {entry.part_of_speech}
            </Badge>
          )}
        </div>
        {entry.explanation && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {entry.explanation}
          </p>
        )}
        {entry.example_sentence && (
          <p className="text-xs italic text-muted-foreground">
            &quot;{entry.example_sentence}&quot;
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          {entry.source_lang && <span>{entry.source_lang.toUpperCase()}</span>}
          {entry.source_lang && entry.target_lang && <span>&rarr;</span>}
          {entry.target_lang && <span>{entry.target_lang.toUpperCase()}</span>}
          <span>&middot;</span>
          <span>{new Date(entry.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(entry.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  )
}
