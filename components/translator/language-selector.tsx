'use client'

import { LANGUAGES } from '@/lib/constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LanguageSelectorProps {
  value: string
  onChange: (lang: string) => void
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const selected = LANGUAGES.find((l) => l.code === value)

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-auto gap-2 rounded-lg border-none bg-transparent px-3 text-sm font-medium shadow-none hover:bg-muted">
        <SelectValue>
          {selected && (
            <span className="flex items-center gap-1.5">
              <span>{selected.flag}</span>
              <span>{selected.name}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
