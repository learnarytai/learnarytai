import {
  getAuthenticatedUser,
  lemonSqueezySetup,
} from '@lemonsqueezy/lemonsqueezy.js'

export function configureLemonSqueezy() {
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
    onError: (error) => console.error('LemonSqueezy error:', error),
  })
}

export async function verifyLemonSqueezySetup() {
  configureLemonSqueezy()
  try {
    const { data } = await getAuthenticatedUser()
    return !!data
  } catch {
    return false
  }
}
