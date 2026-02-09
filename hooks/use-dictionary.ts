'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DictionaryEntry } from '@/lib/types'

export function useDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/dictionary')
      if (res.ok) {
        const data = await res.json()
        setEntries(data)
      }
    } catch (err) {
      console.error('Failed to fetch dictionary:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const addEntry = useCallback(
    async (entry: Omit<DictionaryEntry, 'id' | 'user_id' | 'created_at'>) => {
      try {
        const res = await fetch('/api/dictionary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        })
        if (res.ok) {
          const newEntry = await res.json()
          setEntries((prev) => [newEntry, ...prev])
          return true
        }
        return false
      } catch {
        return false
      }
    },
    []
  )

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/dictionary/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id))
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  return { entries, isLoading, addEntry, deleteEntry, refetch: fetchEntries }
}
