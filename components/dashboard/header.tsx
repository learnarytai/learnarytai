'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/providers/language-provider'
import type { Profile } from '@/lib/types'
import { ProfileDropdown } from './profile-dropdown'
import { BookOpen, Languages } from 'lucide-react'

interface HeaderProps {
  profile: Profile | null
  onLanguageChange?: (lang: string) => void
}

export function Header({ profile, onLanguageChange }: HeaderProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 px-4 pt-3">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between rounded-2xl border bg-background/80 px-4 shadow-sm backdrop-blur-md">
        <Link href="/translator" className="text-base font-bold tracking-tight">
          Learnary Tai
        </Link>

        <div className="flex items-center rounded-xl bg-muted p-1">
          <Link
            href="/translator"
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm transition-all',
              pathname === '/translator'
                ? 'bg-background font-medium text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Languages className="h-3.5 w-3.5" />
            {t('nav.translator')}
          </Link>
          <Link
            href="/dictionary"
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm transition-all',
              pathname === '/dictionary'
                ? 'bg-background font-medium text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            {t('nav.dictionary')}
          </Link>
        </div>

        <ProfileDropdown profile={profile} onLanguageChange={onLanguageChange} />
      </div>
    </header>
  )
}
