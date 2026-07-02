// =============================================================================
// Supabase Authentication Validator
// =============================================================================
// Single-purpose server utility for parsing Supabase session cookies,
// resolving user identity, and enforcing Role-Based Access Control (RBAC).
//
// This module is the ONLY place authentication and authorization logic
// should live. All route loaders/actions must delegate auth checks here.
// =============================================================================

import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { prisma } from "~/utils/prisma-client.server";
import { createClient } from "~/utils/supabase.server";
import type { Role } from "@prisma/client";

// =============================================================================
// Types
// =============================================================================

export interface AuthenticatedUser {
  /** Internal database user ID (cuid) */
  id: string;
  /** Supabase Auth user ID */
  supabaseId: string;
  /** User email address */
  email: string;
  /** User role for RBAC */
  role: Role;
  /** User profile information */
  profile: {
    firstName: string | null;
    lastName: string | null;
    companyName: string | null;
    avatarUrl: string | null;
  } | null;
}

export interface RequireAuthOptions {
  /** Allowed roles. If empty, any authenticated user is permitted. */
  allowedRoles?: Role[];
  /** URL to redirect to on auth failure. Defaults to "/login". */
  loginUrl?: string;
}

// =============================================================================
// Core Authentication Functions
// =============================================================================

/**
 * Validates the Supabase session cookie and resolves the authenticated user
 * from the database. Redirects to login if the session is invalid.
 *
 * Usage in a route loader:
 * ```typescript
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   const user = await requireAuth(request);
 *   // user is guaranteed to be authenticated here
 * }
 * ```
 */
export async function requireAuth(
  request: Request,
  options: RequireAuthOptions = {}
): Promise<AuthenticatedUser> {
  const { allowedRoles = [], loginUrl = "/login" } = options;

  // Step 1: Validate the Supabase session cookie
  const { supabase } = createClient(request);
  const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    throw redirect(loginUrl);
  }

  // Step 2: Resolve the user from our database
  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
    include: {
      profile: {
        select: {
          firstName: true,
          lastName: true,
          companyName: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!dbUser) {
    // User exists in Supabase but not in our database.
    // This can happen on first login — in production, you'd typically
    // create the user record here or redirect to an onboarding flow.
    throw redirect(loginUrl + "?error=user_not_found");
  }

  // Step 3: Enforce RBAC if roles are specified
  if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
    throw new Response("Forbidden: Insufficient permissions", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  return {
    id: dbUser.id,
    supabaseId: dbUser.supabaseId,
    email: dbUser.email,
    role: dbUser.role,
    profile: dbUser.profile,
  };
}

/**
 * Convenience wrapper that requires the ADMIN role.
 * Use this for admin-only routes.
 *
 * Usage:
 * ```typescript
 * export async function loader({ request }: LoaderFunctionArgs) {
 *   const admin = await requireAdmin(request);
 *   // Only ADMIN users reach here
 * }
 * ```
 */
export async function requireAdmin(
  request: Request
): Promise<AuthenticatedUser> {
  return requireAuth(request, { allowedRoles: ["ADMIN"] });
}

/**
 * Convenience wrapper that requires the ESTIMATOR or ADMIN role.
 * Use this for estimator-level routes.
 */
export async function requireEstimator(
  request: Request
): Promise<AuthenticatedUser> {
  return requireAuth(request, { allowedRoles: ["ADMIN", "ESTIMATOR"] });
}

/**
 * Optional authentication check — returns the user if authenticated,
 * or null if not. Does NOT redirect. Useful for public pages that
 * show different content for logged-in users.
 */
export async function getOptionalUser(
  request: Request
): Promise<AuthenticatedUser | null> {
  try {
    const { supabase } = createClient(request);
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            companyName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!dbUser) {
      return null;
    }

    return {
      id: dbUser.id,
      supabaseId: dbUser.supabaseId,
      email: dbUser.email,
      role: dbUser.role,
      profile: dbUser.profile,
    };
  } catch {
    return null;
  }
}
