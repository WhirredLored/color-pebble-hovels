// =============================================================================
// Supabase Server Client Factory
// =============================================================================
// Creates a Supabase client configured for server-side use with cookie-based
// session management via @supabase/ssr. Use this in React Router loaders
// and actions for authenticated Supabase queries.
//
// Compatible with Node.js and Cloudflare Workers runtime.
// This file MUST use the .server.ts suffix to ensure it is never
// bundled for the client.
// =============================================================================

import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export function getSupabaseEnv() {
  const url = process.env.VITE_SUPABASE_URL || "";
  const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
  return { url, publishableKey };
}

export function createClient(request: Request) {
  const headers = new Headers();
  const { url, publishableKey } = getSupabaseEnv();

  if (!url || !publishableKey) {
    // If Supabase credentials are not yet configured, return a mock/warning-safe client
    // so public pages render smoothly without crashing.
    console.warn(
      "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not set."
    );
  }

  const supabase = createServerClient(
    url || "https://placeholder-project.supabase.co",
    publishableKey || "placeholder-publishable-key",
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "") as {
            name: string;
            value: string;
          }[];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  return { supabase, headers };
}
