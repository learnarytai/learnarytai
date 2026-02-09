'use client'

import { LANGUAGES } from '@/lib/constants'
import { useLanguage } from '@/components/providers/language-provider'
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
  const { t } = useLanguage()

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-auto gap-2 rounded-lg border-none bg-transparent px-3 text-sm font-medium shadow-none hover:bg-muted">
        <SelectValue>
          {t(`lang.${value}`)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="rounded-lg">
            {t(`lang.${lang.code}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
