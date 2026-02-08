'use client'

import { WordList } from '@/components/dictionary/word-list'

export default function DictionaryPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">My Dictionary</h1>
      <WordList />
    </div>
  )
}
