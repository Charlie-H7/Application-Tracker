import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
// this is the server client, which is responsible for updating the cookie, which is used for authentication. The browser client is responsible for creating the cookie, but the server client is responsible for updating it when the user logs in or out. This is because the server client has access to the request and response objects, which are needed to set and get cookies. The browser client does not have access to these objects, so it cannot update the cookie directly. Instead, it relies on the server client to do so. This is why we need both a browser client and a server client when using Supabase in a Next.js application.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}