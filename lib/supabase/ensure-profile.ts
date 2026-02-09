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

  // Check if profile already exists
  const { data, error: selectError } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (selectError) {
    console.error('[ensureProfile] SELECT error:', selectError)
  }

  if (data) return data as Profile

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
  }

  console.log('[ensureProfile] Creating profile for:', user.id, user.email)

  const { data: created, error: insertError } = await admin
    .from('profiles')
    .insert(newProfile)
    .select()
    .single()

  if (insertError) {
    console.error('[ensureProfile] INSERT error:', insertError)

    // If conflict (profile was created between select and insert), fetch it
    if (insertError.code === '23505') {
      const { data: existing } = await admin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (existing) return existing as Profile
    }

    // Try upsert as last resort
    const { data: upserted, error: upsertError } = await admin
      .from('profiles')
      .upsert(newProfile, { onConflict: 'id' })
      .select()
      .single()

    if (upsertError) {
      console.error('[ensureProfile] UPSERT error:', upsertError)
      return {
        ...newProfile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Profile
    }

    return upserted as Profile
  }

  console.log('[ensureProfile] Profile created for:', user.id)
  return created as Profile
}
