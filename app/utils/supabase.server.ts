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

import { readServerEnv } from "~/utils/worker-request-scope.server";

export function getSupabaseEnv() {
  const url = readServerEnv("VITE_SUPABASE_URL") || "";
  const publishableKey = readServerEnv("VITE_SUPABASE_PUBLISHABLE_KEY") || "";
  return { url, publishableKey };
}

export function createClient(request: Request) {
  const headers = new Headers();
  const { url, publishableKey } = getSupabaseEnv();

  // Only authenticated routes call this. Fail loudly rather than talking to a
  // placeholder project with fake credentials.
  if (!url || !publishableKey) {
    throw new Error(
      "[Supabase] VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set."
    );
  }

  const supabase = createServerClient(
    url,
    publishableKey,
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
