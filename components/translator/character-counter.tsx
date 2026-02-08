'use client'

import { cn } from '@/lib/utils'

interface CharacterCounterProps {
  current: number
  limit: number
  tier: 'free' | 'pro'
}

export function CharacterCounter({ current, limit, tier }: CharacterCounterProps) {
  if (tier === 'pro') {
    return (
      <div className="text-xs text-muted-foreground">
        {current.toLocaleString()} characters (Pro - unlimited)
      </div>
    )
  }

  const percentage = (current / limit) * 100

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            percentage > 90
              ? 'bg-destructive'
              : percentage > 70
                ? 'bg-yellow-500'
                : 'bg-primary'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span
        className={cn(
          'text-xs',
          percentage > 90 ? 'text-destructive' : 'text-muted-foreground'
        )}
      >
        {current.toLocaleString()}/{limit.toLocaleString()}
      </span>
    </div>
  )
}
