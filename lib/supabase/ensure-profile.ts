import { getAdminClient } from './admin'
import type { Profile } from '@/lib/types'

/**
 * Ensures a profile exists for the given user.
 * Uses admin client (service_role key) to bypass RLS.
 * ONLY use in server-side code (API routes).
 */
export async function ensureProfile(
  user: { id: string; email?: string; user_metadata?: Record<string, string> }
): Promise<Profile> {
  const admin = getAdminClient()

  const { data } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (data) return data as Profile

  // Profile doesn't exist — create it with admin privileges
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
  }

  const { data: created, error } = await admin
    .from('profiles')
    .upsert(newProfile, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    console.error('Failed to create profile:', error)
    return {
      ...newProfile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Profile
  }

  return created as Profile
}
