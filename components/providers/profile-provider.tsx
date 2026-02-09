'use client'

import { createContext, useContext } from 'react'
import type { Profile } from '@/lib/types'

interface ProfileContextType {
  profile: Profile | null
  refreshProfile: () => void
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  refreshProfile: () => {},
})

export function ProfileProvider({
  children,
  profile,
  onRefresh,
}: {
  children: React.ReactNode
  profile: Profile | null
  onRefresh: () => void
}) {
  return (
    <ProfileContext.Provider value={{ profile, refreshProfile: onRefresh }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
