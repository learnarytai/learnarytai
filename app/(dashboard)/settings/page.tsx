'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProfileForm } from '@/components/settings/profile-form'
import { SubscriptionCard } from '@/components/settings/subscription-card'
import type { Profile } from '@/lib/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (data) {
        setProfile(data as Profile)
      } else {
        // Profile doesn't exist — create it
        const newProfile = {
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
        }

        const { data: created } = await supabase
          .from('profiles')
          .upsert(newProfile, { onConflict: 'id' })
          .select()
          .maybeSingle()

        setProfile((created as Profile) || (newProfile as Profile))
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
      <h1 className="text-2xl font-bold">Settings</h1>
      <ProfileForm profile={profile} />
      <SubscriptionCard profile={profile} />
    </div>
  )
}
