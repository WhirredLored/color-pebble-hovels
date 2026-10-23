// =============================================================================
// Prisma Client Factory
// =============================================================================
// Uses the Prisma 7.x driver adapter pattern with @prisma/adapter-pg.
//
// On Cloudflare Workers a client (and its TCP connection) is created per
// request and disconnected after the response via ctx.waitUntil — a connection
// shared across requests hangs the next request. Outside a Worker request
// (Node scripts, seeds) a single process-wide client is reused.
//
// Connection string precedence:
//   1. HYPERDRIVE binding (if configured in wrangler.jsonc)
//   2. DATABASE_URL Worker secret / environment variable
//
// This file MUST use the .server.ts suffix to ensure it is never
// bundled for the client.
// =============================================================================

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import {
  getWorkerRequestScope,
  readServerEnv,
} from "~/utils/worker-request-scope.server";

const SCOPE_KEY = "prisma";

function getConnectionString(): string {
  const hyperdrive = getWorkerRequestScope()?.env.HYPERDRIVE as
    | { connectionString?: string }
    | undefined;
  const url = hyperdrive?.connectionString || readServerEnv("DATABASE_URL");
  if (!url) {
    throw new Error(
      "Database connection string not found. Set the DATABASE_URL secret (or a HYPERDRIVE binding)."
    );
  }
  return url;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: getConnectionString() });
  return new PrismaClient({
    adapter,
    log: readServerEnv("NODE_ENV") === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getClient(): PrismaClient {
  const scope = getWorkerRequestScope();
  if (scope) {
    let client = scope.resources.get(SCOPE_KEY) as PrismaClient | undefined;
    if (!client) {
      client = createPrismaClient();
      scope.resources.set(SCOPE_KEY, client);
      const created = client;
      scope.disposers.push(() => created.$disconnect());
    }
    return client;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy: pages that never touch the database do not need DATABASE_URL,
// and each property access resolves the client for the current request.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const val = (client as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});
