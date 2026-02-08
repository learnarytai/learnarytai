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

      // Use server API to ensure profile exists (bypasses RLS)
      try {
        const res = await fetch('/api/ensure-profile', { method: 'POST' })
        if (res.ok) {
          const data = await res.json()
          // Enrich with Google metadata if available
          if (!data.avatar_url && user.user_metadata?.avatar_url) {
            data.avatar_url = user.user_metadata.avatar_url
          }
          if (!data.full_name && user.user_metadata?.full_name) {
            data.full_name = user.user_metadata.full_name
          }
          setProfile(data as Profile)
          return
        }
      } catch {
        // fallback below
      }

      // Fallback: minimal in-memory profile
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
