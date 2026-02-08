import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-signature')

  if (!signature || !process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
  }

  // Verify webhook signature
  const hmac = crypto.createHmac(
    'sha256',
    process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  )
  const digest = hmac.update(rawBody).digest('hex')

  if (digest !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventName = payload.meta?.event_name
  const customData = payload.meta?.custom_data

  if (!customData?.user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
  }

  const userId = customData.user_id

  switch (eventName) {
    case 'subscription_created':
    case 'subscription_updated': {
      const subscriptionId = String(payload.data?.id)
      const status = payload.data?.attributes?.status
      const endsAt = payload.data?.attributes?.ends_at

      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        lemonsqueezy_id: subscriptionId,
        status,
        plan: 'pro',
        current_period_end: endsAt,
        updated_at: new Date().toISOString(),
      })

      if (status === 'active') {
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_tier: 'pro',
            characters_limit: 999999999,
          })
          .eq('id', userId)
      }
      break
    }

    case 'subscription_cancelled':
    case 'subscription_expired': {
      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_tier: 'free',
          characters_limit: 1000,
        })
        .eq('id', userId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
