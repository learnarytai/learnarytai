'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/dashboard/header'
import { LanguageProvider } from '@/components/providers/language-provider'
import { ProfileProvider } from '@/components/providers/profile-provider'
import { useTheme } from '@/components/providers/theme-provider'
import type { Profile } from '@/lib/types'
import type { Locale } from '@/lib/i18n'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [locale, setLocale] = useState<Locale>('en')
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  const { setTheme } = useTheme()

  function getSupabase() {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient()
    }
    return supabaseRef.current
  }

  // Session check: if "remember me" was unchecked and browser was closed, sign out
  useEffect(() => {
    const rememberMe = localStorage.getItem('remember-me')
    const sessionActive = sessionStorage.getItem('session-active')

    if (rememberMe === 'false' && !sessionActive) {
      // Browser was closed since last login — sign out
      const supabase = getSupabase()
      supabase.auth.signOut().then(() => {
        localStorage.removeItem('remember-me')
        router.push('/login')
        router.refresh()
      })
      return
    }

    // Mark session as active for this tab
    sessionStorage.setItem('session-active', 'true')
  }, [router])

  const loadProfile = useCallback(async () => {
    const supabase = getSupabase()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    try {
      const res = await fetch('/api/ensure-profile', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (!data.avatar_url && user.user_metadata?.avatar_url) {
          data.avatar_url = user.user_metadata.avatar_url
        }
        if (!data.full_name && user.user_metadata?.full_name) {
          data.full_name = user.user_metadata.full_name
        }
        setProfile(data as Profile)
        if (data.interface_language) {
          setLocale(data.interface_language as Locale)
        }
        if (data.theme) {
          setTheme(data.theme)
        }
        return
      }
    } catch {
      // fallback below
    }

    setProfile({
      id: user.id,
      email: user.email || null,
      full_name: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      subscription_tier: 'free',
      characters_used: 0,
      characters_limit: 1000,
      interface_language: 'en',
      theme: 'light',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }, [setTheme])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleLanguageChange = useCallback(
    (lang: string) => {
      setLocale(lang as Locale)
      if (profile) {
        setProfile({ ...profile, interface_language: lang })
      }
    },
    [profile]
  )

  const handleThemeChange = useCallback(
    (theme: string) => {
      if (profile) {
        setProfile({ ...profile, theme: theme as Profile['theme'] })
      }
    },
    [profile]
  )

  return (
    <LanguageProvider locale={locale} onLocaleChange={(l) => handleLanguageChange(l)}>
      <ProfileProvider profile={profile} onRefresh={loadProfile}>
        <div className="h-screen overflow-hidden">
          <Header
            profile={profile}
            onLanguageChange={handleLanguageChange}
            onThemeChange={handleThemeChange}
          />
          <main className="mx-auto max-w-7xl px-4 py-4">{children}</main>
        </div>
      </ProfileProvider>
    </LanguageProvider>
  )
}
