'use client'

import { useRef, useEffect } from 'react'
import { PART_OF_SPEECH_COLORS } from '@/lib/constants'
import { useLanguage } from '@/components/providers/language-provider'
import type { ParsedWord, PartOfSpeech } from '@/lib/types'
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
      className="fixed z-[100] w-80 rounded-xl border shadow-xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y + 8}px`,
        backgroundColor: `${color}15`,
        borderColor: `${color}40`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4">
        {/* Word + POS */}
        <p className="text-base font-bold">{word.translation}</p>
        <p className="text-sm text-muted-foreground">
          {t('tooltip.pos')}: {t(`pos.${word.pos}`)}
        </p>
        {word.grammar && (
          <p className="text-sm text-muted-foreground">{word.grammar}</p>
        )}

        {/* Definition */}
        {word.definition && (
          <div className="mt-3">
            <p className="text-sm font-bold">{t('tooltip.definition')}:</p>
            <p className="text-sm text-foreground/80">{word.definition}</p>
          </div>
        )}

        {/* Example */}
        {word.example && (
          <div className="mt-2">
            <p className="text-sm font-bold">{t('tooltip.example')}:</p>
            <p className="text-sm italic text-foreground/80">{word.example}</p>
          </div>
        )}
      </div>

      {/* Add to Dictionary */}
      <div className="border-t px-4 py-2.5" style={{ borderColor: `${color}30` }}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs"
          onClick={() => onAddToDictionary(word)}
        >
          <Plus className="mr-1 h-3 w-3" />
          {t('translator.addToDictionary')}
        </Button>
      </div>
    </div>
  )
}
