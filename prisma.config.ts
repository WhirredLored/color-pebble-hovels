// =============================================================================
// Prisma Configuration (Prisma 7.x)
// =============================================================================
// Centralizes datasource URL, migration path, and seed command
// configuration. Required by Prisma CLI for migrate/push/seed operations.
// =============================================================================

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  migrate: {
    async adapter() {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      return new PrismaPg({ connectionString: process.env.DIRECT_URL });
    },
  },
});
