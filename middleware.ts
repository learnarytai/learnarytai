import { updateSession } from '@/lib/supabase/middleware'
import { getLanguageByCountry, getLanguageByAcceptHeader } from '@/lib/geo-language'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Detect language: Vercel geo header → Accept-Language header → default 'en'
  const country = request.headers.get('x-vercel-ip-country') || undefined
  let lang: string

  if (country) {
    lang = getLanguageByCountry(country)
    response.headers.set('x-geo-country', country)
  } else {
    const acceptLang = request.headers.get('accept-language') || ''
    lang = getLanguageByAcceptHeader(acceptLang)
  }

  response.cookies.set('geo-lang', lang, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  })
  response.headers.set('x-geo-lang', lang)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
