'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'
import { ProfileDropdown } from './profile-dropdown'
import { BookOpen, Languages } from 'lucide-react'

interface HeaderProps {
  profile: Profile | null
}

const navItems = [
  { href: '/translator', label: 'Translator', icon: Languages },
  { href: '/dictionary', label: 'Dictionary', icon: BookOpen },
]

export function Header({ profile }: HeaderProps) {
  const pathname = usePathname()

  const charPercent =
    profile && profile.characters_limit !== Infinity
      ? Math.round((profile.characters_used / profile.characters_limit) * 100)
      : null

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/translator" className="flex items-center gap-2 font-semibold">
            <Languages className="h-5 w-5 text-primary" />
            <span>LinguaLearn</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent',
                  pathname === item.href
                    ? 'bg-accent font-medium text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {charPercent !== null && profile && (
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    charPercent > 90 ? 'bg-destructive' : 'bg-primary'
                  )}
                  style={{ width: `${Math.min(charPercent, 100)}%` }}
                />
              </div>
              <span>
                {profile.characters_used.toLocaleString()}/
                {profile.characters_limit.toLocaleString()}
              </span>
            </div>
          )}
          <ProfileDropdown profile={profile} />
        </div>
      </div>
    </header>
  )
}
