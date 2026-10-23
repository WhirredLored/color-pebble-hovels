/// <reference types="@cloudflare/workers-types" />
import {
  createRequestHandler,
  RouterContextProvider,
  createContext,
} from "react-router";

import { runWithWorkerRequestScope } from "../app/utils/worker-request-scope.server";

declare global {
  interface CloudflareEnvironment extends Env {}
}

export interface Env {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  DATABASE_URL?: string;
  HYPERDRIVE?: Hyperdrive;
  PHOTOS?: R2Bucket;
  NODE_ENV?: string;
}

/** Canonical production host. Requests to the www host are redirected here. */
const CANONICAL_HOST = "huestonehomes.com";
const REDIRECT_HOSTS = new Set([`www.${CANONICAL_HOST}`]);

export const cloudflareContext = createContext<{
  env: Env;
  ctx: ExecutionContext;
}>();

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

/**
 * Returns a permanent redirect for non-canonical production requests:
 * www.huestonehomes.com -> huestonehomes.com, and http -> https on our hosts.
 * workers.dev and localhost are left untouched for testing.
 */
function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const isOurHost = url.hostname === CANONICAL_HOST || REDIRECT_HOSTS.has(url.hostname);
  if (!isOurHost) return null;

  if (REDIRECT_HOSTS.has(url.hostname) || url.protocol === "http:") {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.hostname === "photos.huestonehomes.com" || url.pathname.startsWith("/photos/")) {
      const key = url.pathname.replace(/^\/+/, "");
      if (key && env.PHOTOS) {
        const object = await env.PHOTOS.get(key);
        if (object) {
          const headers = new Headers();
          object.writeHttpMetadata(headers);
          headers.set("etag", object.httpEtag);
          headers.set("Cache-Control", "public, max-age=86400");
          return new Response(object.body, { headers });
        }
      }
    }

    const redirect = canonicalRedirect(request);
    if (redirect) return redirect;

    return runWithWorkerRequestScope(
      env as unknown as Record<string, unknown>,
      async (scope) => {
        const context = new RouterContextProvider();
        context.set(cloudflareContext, { env, ctx });
        try {
          const response = await requestHandler(request, context);
          if (new URL(request.url).hostname === CANONICAL_HOST) {
            response.headers.set(
              "Strict-Transport-Security",
              "max-age=31536000; includeSubDomains"
            );
          }
          return response;
        } finally {
          // Release per-request resources (e.g. the Prisma/pg connection)
          // without delaying the response.
          for (const dispose of scope.disposers) {
            ctx.waitUntil(
              dispose().catch((error) =>
                console.error("Failed to release request resource", error)
              )
            );
          }
        }
      }
    );
  },
} satisfies ExportedHandler<CloudflareEnvironment>;
