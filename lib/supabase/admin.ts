import { createClient, SupabaseClient } from '@supabase/supabase-js'

let adminClient: SupabaseClient | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAdminClient(): any {
  if (adminClient) return adminClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('[AdminClient] Missing env vars:', {
      hasUrl: !!url,
      hasKey: !!key,
      keyLength: key?.length ?? 0,
    })
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for admin client')
  }

  adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  return adminClient
}
