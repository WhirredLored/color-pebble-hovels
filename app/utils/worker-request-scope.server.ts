// =============================================================================
// Worker Request Scope
// =============================================================================
// Carries the Cloudflare Worker `env` bindings and per-request resources
// (such as the Prisma client) through the async call stack of one request.
//
// Why: Cloudflare Workers forbid reusing I/O objects (TCP sockets, database
// connections) across requests — a connection opened during one request hangs
// or throws when touched by another. Every database client must therefore be
// created per request and closed when that request finishes. AsyncLocalStorage
// lets repositories keep importing `prisma` without threading context through
// every function signature.
//
// This file MUST use the .server.ts suffix so it is never bundled for the client.
// =============================================================================

import { AsyncLocalStorage } from "node:async_hooks";

export interface WorkerRequestScope {
  /** Bindings, variables and secrets for the current Worker invocation. */
  env: Record<string, unknown>;
  /** Lazily created resources that must be released after the request. */
  disposers: Array<() => Promise<unknown>>;
  /** Per-request cache for lazily created clients. */
  resources: Map<string, unknown>;
}

const storage = new AsyncLocalStorage<WorkerRequestScope>();

export function runWithWorkerRequestScope<T>(
  env: Record<string, unknown>,
  callback: (scope: WorkerRequestScope) => Promise<T>
): Promise<T> {
  const scope: WorkerRequestScope = { env, disposers: [], resources: new Map() };
  return storage.run(scope, () => callback(scope));
}

export function getWorkerRequestScope(): WorkerRequestScope | undefined {
  return storage.getStore();
}

/** Reads a string variable or secret from the Worker env, then process.env. */
export function readServerEnv(name: string): string | undefined {
  const fromScope = getWorkerRequestScope()?.env[name];
  if (typeof fromScope === "string" && fromScope.length > 0) {
    return fromScope;
  }
  if (typeof process !== "undefined") {
    const fromProcess = process.env?.[name];
    if (fromProcess) {
      return fromProcess;
    }
  }
  return undefined;
}
