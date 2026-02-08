'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TranslationArea } from '@/components/translator/translation-area'
import type { Profile } from '@/lib/types'

export default function TranslatorPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) setProfile(data as Profile)
      }
    }
    loadProfile()
  }, [supabase])

  return (
    <div>
      <TranslationArea profile={profile} />
    </div>
  )
}
