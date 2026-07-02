// =============================================================================
// WorkOS Authentication Validator
// =============================================================================
// Single-purpose server utility for parsing WorkOS session cookies,
// resolving user identity, and enforcing Role-Based Access Control (RBAC).
//
// This module is the ONLY place authentication and authorization logic
// should live. All route loaders/actions must delegate auth checks here.
// =============================================================================

import {
  authkitLoader,
  type AuthKitLoaderOptions,
} from "@workos-inc/authkit-react-router";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { prisma } from "~/utils/prisma-client.server";
import type { Role } from "@prisma/client";

// =============================================================================
// Types
// =============================================================================

export interface AuthenticatedUser {
  /** Internal database user ID (cuid) */
  id: string;
  /** WorkOS user ID */
  workosId: string;
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
 * Validates the WorkOS session cookie and resolves the authenticated user
 * from the database. Redirects to login if the session is invalid.
 *
 * Usage in a route loader:
 * ```typescript
 * export async function loader(args: LoaderFunctionArgs) {
 *   const user = await requireAuth(args);
 *   // user is guaranteed to be authenticated here
 * }
 * ```
 */
export async function requireAuth(
  args: LoaderFunctionArgs,
  options: RequireAuthOptions = {}
): Promise<AuthenticatedUser> {
  const { allowedRoles = [], loginUrl = "/login" } = options;

  // Step 1: Validate the WorkOS session cookie
  const authResponse = await authkitLoader(args, {
    ensureSignedIn: true,
  } satisfies AuthKitLoaderOptions);

  // authkitLoader returns a Response (redirect) if not signed in.
  // If we reach here, the user IS authenticated.
  // Extract user data from the authkit response.
  const authData =
    authResponse instanceof Response
      ? null
      : (authResponse as Record<string, unknown>);

  if (!authData || !authData.user) {
    throw redirect(loginUrl);
  }

  const workosUser = authData.user as { id: string; email: string };

  // Step 2: Resolve the user from our database
  const dbUser = await prisma.user.findUnique({
    where: { workosId: workosUser.id },
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
    // User exists in WorkOS but not in our database.
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
    workosId: dbUser.workosId,
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
 * export async function loader(args: LoaderFunctionArgs) {
 *   const admin = await requireAdmin(args);
 *   // Only ADMIN users reach here
 * }
 * ```
 */
export async function requireAdmin(
  args: LoaderFunctionArgs
): Promise<AuthenticatedUser> {
  return requireAuth(args, { allowedRoles: ["ADMIN"] });
}

/**
 * Convenience wrapper that requires the ESTIMATOR or ADMIN role.
 * Use this for estimator-level routes.
 */
export async function requireEstimator(
  args: LoaderFunctionArgs
): Promise<AuthenticatedUser> {
  return requireAuth(args, { allowedRoles: ["ADMIN", "ESTIMATOR"] });
}

/**
 * Optional authentication check — returns the user if authenticated,
 * or null if not. Does NOT redirect. Useful for public pages that
 * show different content for logged-in users.
 */
export async function getOptionalUser(
  args: LoaderFunctionArgs
): Promise<AuthenticatedUser | null> {
  try {
    const authResponse = await authkitLoader(args, {
      ensureSignedIn: false,
    } satisfies AuthKitLoaderOptions);

    const authData =
      authResponse instanceof Response
        ? null
        : (authResponse as Record<string, unknown>);

    if (!authData || !authData.user) {
      return null;
    }

    const workosUser = authData.user as { id: string; email: string };

    const dbUser = await prisma.user.findUnique({
      where: { workosId: workosUser.id },
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
      workosId: dbUser.workosId,
      email: dbUser.email,
      role: dbUser.role,
      profile: dbUser.profile,
    };
  } catch {
    return null;
  }
}
