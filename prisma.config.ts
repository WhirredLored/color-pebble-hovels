// =============================================================================
// Prisma Configuration (Prisma 7.x)
// =============================================================================
// Centralizes datasource URL, migration path, and seed command
// configuration. Required by Prisma CLI for migrate/push/seed operations.
// =============================================================================

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
