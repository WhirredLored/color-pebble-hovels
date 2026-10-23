// =============================================================================
// Database Client Factory
// =============================================================================
// Uses node-postgres (pg) on Cloudflare Workers (and Node.js).
//
// Cloudflare Workers disallows dynamic runtime WebAssembly compilation from
// base64 buffers, which causes Prisma 7's query compiler to fail with
// CompileError: WebAssembly.Module(): Wasm code generation disallowed by embedder.
//
// By using a direct pure-JS PostgreSQL driver (pg) with Cloudflare's
// nodejs_compat TCP sockets, queries run natively, fast, and without any
// runtime Wasm compilation issues.
//
// On Cloudflare Workers a connection is established per request and closed
// after the response via ctx.waitUntil (through worker-request-scope disposers).
// =============================================================================

import { Client } from "pg";
import type { PrismaClient } from "@prisma/client";

import {
  getWorkerRequestScope,
  readServerEnv,
} from "~/utils/worker-request-scope.server";

const SCOPE_KEY = "pg_client";

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

let globalClient: Client | null = null;

async function getPgClient(): Promise<Client> {
  const scope = getWorkerRequestScope();
  if (scope) {
    let client = scope.resources.get(SCOPE_KEY) as Client | undefined;
    if (!client) {
      client = new Client({
        connectionString: getConnectionString(),
      });
      await client.connect();
      scope.resources.set(SCOPE_KEY, client);
      const activeClient = client;
      scope.disposers.push(() => activeClient.end());
    }
    return client;
  }

  if (!globalClient) {
    globalClient = new Client({
      connectionString: getConnectionString(),
    });
    await globalClient.connect();
  }
  return globalClient;
}

export const prisma = {
  contactInquiry: {
    async create({
      data,
      select,
    }: {
      data: {
        name: string;
        email: string;
        phone?: string | null;
        address?: string | null;
        message: string;
      };
      select?: { id?: boolean };
    }): Promise<{ id: string }> {
      const client = await getPgClient();
      const id = crypto.randomUUID();
      const res = await client.query(
        `INSERT INTO "contact_inquiries" ("id", "name", "email", "phone", "address", "message", "created_at", "updated_at")
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING "id"`,
        [id, data.name, data.email, data.phone ?? null, data.address ?? null, data.message]
      );
      return { id: res.rows[0].id };
    },

    async findMany(args?: {
      where?: { email?: string };
      take?: number;
      orderBy?: { createdAt?: "asc" | "desc" };
    }) {
      const client = await getPgClient();
      let query = `SELECT "id", "name", "email", "phone", "address", "message", "created_at" AS "createdAt", "updated_at" AS "updatedAt" FROM "contact_inquiries"`;
      const params: unknown[] = [];
      if (args?.where?.email) {
        query += ` WHERE "email" = $1`;
        params.push(args.where.email);
      }
      query += ` ORDER BY "created_at" ${args?.orderBy?.createdAt === "asc" ? "ASC" : "DESC"}`;
      if (args?.take) {
        params.push(args.take);
        query += ` LIMIT $${params.length}`;
      }
      const res = await client.query(query, params);
      return res.rows;
    },

    async deleteMany(args?: { where?: { email?: string } }) {
      const client = await getPgClient();
      let query = `DELETE FROM "contact_inquiries"`;
      const params: unknown[] = [];
      if (args?.where?.email) {
        query += ` WHERE "email" = $1`;
        params.push(args.where.email);
      }
      const res = await client.query(query, params);
      return { count: res.rowCount ?? 0 };
    },

    async count() {
      const client = await getPgClient();
      const res = await client.query(`SELECT COUNT(*)::int AS count FROM "contact_inquiries"`);
      return res.rows[0]?.count ?? 0;
    },
  },

  user: {
    async findUnique(args: {
      where: { supabaseId?: string; id?: string; email?: string };
      select?: Record<string, boolean>;
    }) {
      const client = await getPgClient();
      let res;
      if (args.where.supabaseId) {
        res = await client.query(
          `SELECT "id", "supabase_id" AS "supabaseId", "email", "role", "created_at" AS "createdAt", "updated_at" AS "updatedAt"
           FROM "users" WHERE "supabase_id" = $1 LIMIT 1`,
          [args.where.supabaseId]
        );
      } else if (args.where.id) {
        res = await client.query(
          `SELECT "id", "supabase_id" AS "supabaseId", "email", "role", "created_at" AS "createdAt", "updated_at" AS "updatedAt"
           FROM "users" WHERE "id" = $1 LIMIT 1`,
          [args.where.id]
        );
      } else if (args.where.email) {
        res = await client.query(
          `SELECT "id", "supabase_id" AS "supabaseId", "email", "role", "created_at" AS "createdAt", "updated_at" AS "updatedAt"
           FROM "users" WHERE "email" = $1 LIMIT 1`,
          [args.where.email]
        );
      }
      if (!res || res.rows.length === 0) return null;
      const row = res.rows[0];
      if (args.select) {
        const selected: Record<string, unknown> = {};
        for (const key of Object.keys(args.select)) {
          if (args.select[key]) selected[key] = row[key];
        }
        return selected;
      }
      return row;
    },
  },

  $queryRaw: async (query: string, ...params: unknown[]) => {
    const client = await getPgClient();
    const res = await client.query(query, params);
    return res.rows;
  },

  $executeRaw: async (query: string, ...params: unknown[]) => {
    const client = await getPgClient();
    const res = await client.query(query, params);
    return res.rowCount ?? 0;
  },

  $disconnect: async () => {
    if (globalClient) {
      await globalClient.end();
      globalClient = null;
    }
  },
} as unknown as PrismaClient;
