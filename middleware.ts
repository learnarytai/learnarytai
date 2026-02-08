import { updateSession } from '@/lib/supabase/middleware'
import { getLanguageByCountry } from '@/lib/geo-language'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Always detect country and set geo cookie
  const country = request.headers.get('x-vercel-ip-country') || undefined
  if (country) {
    const lang = getLanguageByCountry(country)
    response.cookies.set('geo-lang', lang, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    })
    response.headers.set('x-geo-country', country)
    response.headers.set('x-geo-lang', lang)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
