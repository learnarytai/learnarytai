'use client'

import { useProfile } from '@/components/providers/profile-provider'
import { useLanguage } from '@/components/providers/language-provider'
import { ProfileForm } from '@/components/settings/profile-form'
import { SubscriptionCard } from '@/components/settings/subscription-card'

export default function SettingsPage() {
  const { profile } = useProfile()
  const { t } = useLanguage()

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
