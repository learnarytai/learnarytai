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
          {selected && <span>{selected.name}</span>}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
            <span>{lang.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
