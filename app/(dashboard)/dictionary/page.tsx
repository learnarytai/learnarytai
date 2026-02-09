'use client'

import { useLanguage } from '@/components/providers/language-provider'
import { WordList } from '@/components/dictionary/word-list'

export default function DictionaryPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">{t('dictionary.title')}</h1>
      <WordList />
    </div>
  )
}
