// =============================================================================
// Prisma Client Singleton
// =============================================================================
// Prevents PrismaClient connection exhaustion during development HMR.
// Uses the Prisma 7.x driver adapter pattern with @prisma/adapter-pg.
//
// This file MUST use the .server.ts suffix to ensure it is never
// bundled for the client.
// =============================================================================

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  return client;
}

// In development, store the client on `globalThis` to survive HMR reloads.
// In production, always create a fresh instance.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
