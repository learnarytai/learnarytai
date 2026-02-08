import { createClient } from '@/lib/supabase/server'
import { ensureProfile } from '@/lib/supabase/ensure-profile'
import { getAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure profile exists (uses admin client)
  await ensureProfile(user)

  const body = await request.json()

  // Only allow updating specific fields
  const allowedFields = ['full_name', 'interface_language', 'theme']
  const updates: Record<string, string> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field]
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  updates.updated_at = new Date().toISOString()

  // Use admin client to bypass RLS
  const { data, error } = await getAdminClient()
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
