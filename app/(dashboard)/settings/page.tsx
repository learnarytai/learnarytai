'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/components/providers/language-provider'
import { ProfileForm } from '@/components/settings/profile-form'
import { SubscriptionCard } from '@/components/settings/subscription-card'
import type { Profile } from '@/lib/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      try {
        const res = await fetch('/api/ensure-profile', { method: 'POST' })
        if (res.ok) {
          const data = await res.json()
          setProfile(data as Profile)
          return
        }
      } catch {
        // spinner stays
      }
    }
    loadProfile()
  }, [supabase])

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
      <ProfileForm profile={profile} />
      <SubscriptionCard profile={profile} />
    </div>
  )
}
