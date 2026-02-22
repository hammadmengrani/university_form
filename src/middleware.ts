import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { StaffRole } from './types'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete({ name, ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  if (!session && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (session && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  if (session && pathname.startsWith('/admin')) {
    const { data: staffUser, error } = await supabase
      .from('staff_users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (error || !staffUser) {
        await supabase.auth.signOut();
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('error', 'access_denied')
        return NextResponse.redirect(redirectUrl)
    }

    const userRole = staffUser.role as StaffRole;

    // Add role to the request headers to be accessible in server components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-role', userRole)
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    if (pathname.startsWith('/admin/staff') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root page)
     * - /apply (public application form)
     * - /track (public status tracker)
     */
    '/((?!_next/static|_next/image|favicon.ico|apply|track|auth/callback|$).*)',
    '/auth/login'
  ],
}
