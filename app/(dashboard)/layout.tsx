'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/dashboard/header'
import type { Profile } from '@/lib/types'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Try to get profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (data) {
        // If no avatar in profile, try to get from auth metadata (Google)
        if (!data.avatar_url && user.user_metadata?.avatar_url) {
          data.avatar_url = user.user_metadata.avatar_url
        }
        if (!data.full_name && user.user_metadata?.full_name) {
          data.full_name = user.user_metadata.full_name
        }
        setProfile(data as Profile)
      } else {
        // Profile doesn't exist yet, create a minimal one for display
        setProfile({
          id: user.id,
          email: user.email || null,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          subscription_tier: 'free',
          characters_used: 0,
          characters_limit: 1000,
          interface_language: 'uk',
          theme: 'light',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    }
    loadProfile()
  }, [supabase])

  return (
    <div className="h-screen overflow-hidden">
      <Header profile={profile} />
      <main className="mx-auto max-w-7xl px-4 py-4">{children}</main>
    </div>
  )
}
