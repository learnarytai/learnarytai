'use client'

import { useRef, useEffect } from 'react'
import { PART_OF_SPEECH_COLORS } from '@/lib/constants'
import { useLanguage } from '@/components/providers/language-provider'
import type { ParsedWord, PartOfSpeech } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface WordTooltipProps {
  word: ParsedWord
  position: { x: number; y: number }
  onAddToDictionary: (word: ParsedWord) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function WordTooltip({ word, position, onAddToDictionary, onMouseEnter, onMouseLeave }: WordTooltipProps) {
  const color = PART_OF_SPEECH_COLORS[word.pos as PartOfSpeech] || '#e5e5e5'
  const tooltipRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    if (!tooltipRef.current) return
    const rect = tooltipRef.current.getBoundingClientRect()
    const el = tooltipRef.current

    if (rect.right > window.innerWidth - 16) {
      el.style.left = `${window.innerWidth - rect.width - 16}px`
    }
    if (rect.bottom > window.innerHeight - 16) {
      el.style.top = `${position.y - rect.height - 12}px`
    }
  }, [position])

  return (
    <div
      ref={tooltipRef}
      className="fixed z-[100] w-80 rounded-xl border bg-popover p-4 shadow-xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 8}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold">{word.original}</p>
          <p className="text-sm text-muted-foreground">{word.translation}</p>
        </div>
        <Badge
          variant="secondary"
          style={{ backgroundColor: `${color}40`, color: '#333', border: `1px solid ${color}` }}
          className="shrink-0 text-xs font-medium"
        >
          {t(`pos.${word.pos}`)}
        </Badge>
      </div>

      {word.explanation && (
        <div className="mb-3 rounded-lg bg-muted/50 p-2.5">
          <p className="text-xs leading-relaxed text-foreground/80">
            {word.explanation}
          </p>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={() => onAddToDictionary(word)}
      >
        <Plus className="mr-1 h-3 w-3" />
        {t('translator.addToDictionary')}
      </Button>
    </div>
  )
}
