'use client'

import { useState } from 'react'
import type { Profile } from '@/lib/types'
import { useLanguage } from '@/components/providers/language-provider'
import { useProfile } from '@/components/providers/profile-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [saving, setSaving] = useState(false)
  const { t } = useLanguage()
  const { refreshProfile } = useProfile()

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName }),
      })
      if (res.ok) {
        toast.success(t('settings.profileUpdated'))
        // Refresh profile in layout so header shows new name
        refreshProfile()
      } else {
        toast.error(t('settings.updateFailed'))
      }
    } catch {
      toast.error(t('settings.updateFailed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.profile')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input id="email" value={profile.email || ''} disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">{t('settings.fullName')}</Label>
          <Input
            id="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? t('settings.saving') : t('settings.saveChanges')}
        </Button>
      </CardContent>
    </Card>
  )
}
