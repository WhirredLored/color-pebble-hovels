// =============================================================================
// Prisma Client Singleton
// =============================================================================
// Prevents PrismaClient connection exhaustion during development HMR.
// Uses the Prisma 7.x driver adapter pattern with @prisma/adapter-pg.
// Compatible with Node.js and Cloudflare Workers (nodejs_compat).
//
// This file MUST use the .server.ts suffix to ensure it is never
// bundled for the client.
// =============================================================================

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function getConnectionString(): string {
  const url = process.env.HYPERDRIVE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Database connection string not found. Please set DATABASE_URL (or HYPERDRIVE_URL) in environment variables."
    );
  }
  return url;
}

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: getConnectionString(),
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

// In development, store the client on `globalThis` to survive HMR reloads.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}

// Lazy proxy so that pages not requiring the database do not error if
// DATABASE_URL is not yet configured.
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
