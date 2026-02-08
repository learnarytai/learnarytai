import { updateSession } from '@/lib/supabase/middleware'
import { getLanguageByCountry } from '@/lib/geo-language'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Set geo-detected language cookie if not already set
  if (!request.cookies.get('geo-lang')) {
    const country = request.headers.get('x-vercel-ip-country') || undefined
    const lang = getLanguageByCountry(country)
    response.cookies.set('geo-lang', lang, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
