'use client'

import { useState } from 'react'
import { useDictionary } from '@/hooks/use-dictionary'
import { useLanguage } from '@/components/providers/language-provider'
import { WordCard } from './word-card'
import { Input } from '@/components/ui/input'
import { Search, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

export function WordList() {
  const { entries, isLoading, deleteEntry } = useDictionary()
  const [search, setSearch] = useState('')
  const { t } = useLanguage()

  const filtered = entries.filter(
    (e) =>
      e.source_word.toLowerCase().includes(search.toLowerCase()) ||
      e.translation.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    const success = await deleteEntry(id)
    if (success) {
      toast.success(t('dictionary.deleted'))
    } else {
      toast.error(t('dictionary.failedAdd'))
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('dictionary.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
          <BookOpen className="h-10 w-10 opacity-30" />
          <p className="text-sm">{t('dictionary.empty')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {filtered.length} word{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map((entry) => (
            <WordCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
