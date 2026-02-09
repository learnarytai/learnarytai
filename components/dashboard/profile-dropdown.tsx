'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/providers/theme-provider'
import { useLanguage } from '@/components/providers/language-provider'
import { UI_LANGUAGES } from '@/lib/constants'
import type { Profile } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Settings, Globe, Sun, Moon, Monitor, LogOut, User } from 'lucide-react'

interface ProfileDropdownProps {
  profile: Profile | null
  onLanguageChange?: (lang: string) => void
  onThemeChange?: (theme: string) => void
}

export function ProfileDropdown({
  profile,
  onLanguageChange,
  onThemeChange,
}: ProfileDropdownProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : null

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleLanguageChange = (lang: string) => {
    // Update UI instantly, save to server in background
    onLanguageChange?.(lang)
    fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interface_language: lang }),
    }).catch((err) => console.error('Failed to update language:', err))
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    onThemeChange?.(newTheme)
    fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: newTheme }),
    }).catch((err) => console.error('Failed to update theme:', err))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-muted">
              {initials || <User className="h-4 w-4 text-muted-foreground" />}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{profile?.full_name || t('profile.user')}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')} className="rounded-lg">
          <Settings className="mr-2 h-4 w-4" />
          {t('profile.settings')}
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg">
            <Globe className="mr-2 h-4 w-4" />
            {t('profile.language')}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="rounded-xl">
            {UI_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="rounded-lg"
              >
                {lang.name}
                {profile?.interface_language === lang.code && (
                  <span className="ml-auto text-xs text-primary">&#10003;</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg">
            {theme === 'dark' ? (
              <Moon className="mr-2 h-4 w-4" />
            ) : (
              <Sun className="mr-2 h-4 w-4" />
            )}
            {t('profile.theme')}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="rounded-xl">
            <DropdownMenuItem onClick={() => handleThemeChange('light')} className="rounded-lg">
              <Sun className="mr-2 h-4 w-4" />
              {t('profile.light')}
              {theme === 'light' && <span className="ml-auto text-xs text-primary">&#10003;</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange('dark')} className="rounded-lg">
              <Moon className="mr-2 h-4 w-4" />
              {t('profile.dark')}
              {theme === 'dark' && <span className="ml-auto text-xs text-primary">&#10003;</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange('system')} className="rounded-lg">
              <Monitor className="mr-2 h-4 w-4" />
              {t('profile.system')}
              {theme === 'system' && <span className="ml-auto text-xs text-primary">&#10003;</span>}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {t('profile.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
