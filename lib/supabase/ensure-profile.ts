import { SupabaseClient } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

/**
 * Ensures a profile exists for the given user.
 * If no profile row exists, creates one with defaults.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: { id: string; email?: string; user_metadata?: Record<string, string> }
): Promise<Profile> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data: created, error } = await supabase
    .from('profiles')
    .upsert(newProfile, { onConflict: 'id' })
    .select()
    .maybeSingle()

  if (error) {
    console.error('Failed to create profile:', error)
    // Return a fallback in-memory profile so the app doesn't crash
    return newProfile as Profile
  }

  return (created as Profile) || (newProfile as Profile)
}
