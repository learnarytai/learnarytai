'use client'

import { LANGUAGES } from '@/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ArrowLeftRight } from 'lucide-react'

interface LanguageSelectorProps {
  sourceLang: string
  targetLang: string
  onSourceChange: (lang: string) => void
  onTargetChange: (lang: string) => void
  onSwap: () => void
}

export function LanguageSelector({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  onSwap,
}: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={sourceLang} onValueChange={onSourceChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" size="icon" onClick={onSwap} className="shrink-0">
        <ArrowLeftRight className="h-4 w-4" />
      </Button>

      <Select value={targetLang} onValueChange={onTargetChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
