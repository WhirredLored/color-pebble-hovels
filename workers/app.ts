/// <reference types="@cloudflare/workers-types" />
import {
  createRequestHandler,
  RouterContextProvider,
  createContext,
} from "react-router";

declare global {
  interface CloudflareEnvironment extends Env {}
}

export interface Env {
  PORTFOLIO_BUCKET?: R2Bucket;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  DATABASE_URL?: string;
  HYPERDRIVE?: Hyperdrive;
  VITE_PHOTO_CDN_URL?: string;
  NODE_ENV?: string;
}

export const cloudflareContext = createContext<{
  env: Env;
  ctx: ExecutionContext;
}>();

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    const context = new RouterContextProvider();
    context.set(cloudflareContext, { env, ctx });
    return requestHandler(request, context);
  },
} satisfies ExportedHandler<CloudflareEnvironment>;
