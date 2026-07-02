# Huestone Homes LLC — Repository Constitution

> **This file is the supreme architectural authority for the Huestone Homes codebase.**
> Every contributor, AI agent, and automated tool must comply with these laws.

---

## 1. Project Identity

- **Company**: Huestone Homes LLC ([huestonehomes.com](http://huestonehomes.com))
- **Domain**: High-end home restoration, painting, and CNC carving services
- **Application Type**: Installable Progressive Web App (PWA)
- **Future Pipeline**: Native Android & iOS mobile applications
- **Framework**: React Router v7+ (Full-Stack Framework Mode)

---

## 2. Tech Stack (Immutable)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Router v7 (Server Loaders/Actions) | 8.x |
| Database | PostgreSQL (hosted on Supabase) | 15+ |
| ORM | Prisma | Latest |
| Authentication | WorkOS AuthKit (`@workos-inc/authkit-react-router`) | Latest |
| Styling | Tailwind CSS | v4 |
| UI Components | Shadcn UI | Latest |
| Language | TypeScript | 5.x (strict mode) |
| Runtime | Node.js | 20+ LTS |

---

## 3. Architectural Laws

### Law 1: File Naming & Single-Function Isolation

Every business service, database repository query, data validator, and payment utility **must** reside in an explicitly named file that defines its single function.

**Examples of compliant naming:**
```
services/stripe-invoice-sync.server.ts      → Syncs invoices with Stripe
services/workos-auth-validator.server.ts     → Validates WorkOS sessions
repositories/estimate-mutations.server.ts    → Estimate create/update/delete
repositories/project-queries.server.ts       → Project read operations
validators/estimate-input.ts                 → Zod schema for estimate forms
utils/currency-formatter.ts                  → Currency display utilities
```

**Violations:**
- ❌ `services/helpers.ts` (ambiguous)
- ❌ `utils/index.ts` with multiple unrelated exports (barrel of unrelated functions)
- ❌ Business logic directly in route `loader`/`action` functions

### Law 2: Route Architecture (File-System Routing)

React Router's file-system routing convention mandates `route.tsx` files. To compensate, **every route folder must be meticulously named by its specific business domain or operational feature**.

**Compliant route structure:**
```
app/routes/
├── _auth.login/route.tsx                    → Login page
├── _auth.callback/route.tsx                 → WorkOS OAuth callback
├── client.dashboard/route.tsx               → Client dashboard layout
├── client.dashboard.projects/route.tsx      → Client project list
├── client.dashboard.estimates/route.tsx     → Client estimate view
├── admin.dashboard/route.tsx                → Admin dashboard layout
├── admin.dashboard.projects/route.tsx       → Admin project management
├── admin.dashboard.invoices/route.tsx       → Admin invoice management
├── api.webhooks.stripe/route.tsx            → Stripe webhook handler
├── api.webhooks.docusign/route.tsx          → DocuSign webhook handler
```

**Violations:**
- ❌ `routes/page1/route.tsx` (meaningless name)
- ❌ `routes/dashboard/route.tsx` (ambiguous — which dashboard?)

### Law 3: Strict Separation of Concerns

> **Core Rule**: No cross-contamination of client-side UI with backend operations.

Loaders and Actions **must delegate all heavy lifting** to independent service modules. This keeps core logic ready for future native app API consumers.

**Compliant pattern:**
```typescript
// app/routes/client.dashboard.estimates/route.tsx
import { getEstimatesForUser } from "~/repositories/estimate-queries.server";
import { requireAuth } from "~/services/workos-auth-validator.server";

export async function loader(args: LoaderFunctionArgs) {
  const user = await requireAuth(args);
  const estimates = await getEstimatesForUser(user.id);
  return { estimates };
}

export default function EstimatesPage() {
  const { estimates } = useLoaderData<typeof loader>();
  return <EstimateList estimates={estimates} />;
}
```

**Violations:**
- ❌ Direct Prisma queries inside `loader` or `action` functions
- ❌ Authentication checks inline in route files
- ❌ Stripe API calls from route files

### Law 4: Server-Only Enforcement

All files containing server-side logic (database queries, API keys, authentication) **must** use the `.server.ts` suffix. This ensures React Router's compiler never bundles them for the client.

```
✅ services/stripe-invoice-sync.server.ts
✅ repositories/estimate-queries.server.ts
✅ utils/prisma-client.server.ts
❌ services/stripe-invoice-sync.ts  (could leak to client bundle)
```

---

## 4. Directory Structure

```
huestone-homes/
├── app/
│   ├── components/          # Reusable React components
│   │   └── ui/              # Shadcn UI components (auto-generated)
│   ├── routes/              # React Router file-system routes
│   ├── services/            # Business logic modules (.server.ts)
│   ├── repositories/        # Prisma database queries (.server.ts)
│   ├── validators/          # Zod input validation schemas
│   ├── utils/               # Shared utilities & helpers
│   ├── types/               # TypeScript type definitions & enums
│   ├── hooks/               # Custom React hooks
│   ├── root.tsx             # Root layout component
│   ├── routes.ts            # Route configuration
│   └── app.css              # Global styles (Tailwind v4 entry)
├── prisma/
│   ├── schema.prisma        # Database schema definition
│   └── seed.ts              # Database seeding script
├── public/                  # Static assets
├── claude.md                # THIS FILE — Repository constitution
├── .env                     # Environment variables (never committed)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── react-router.config.ts
```

---

## 5. Module Responsibility Matrix

| Module | Responsibility | Can Import From |
|--------|---------------|-----------------|
| `routes/` | UI rendering, loader/action delegation only | services, repositories, validators, components, types, hooks |
| `services/` | Business logic orchestration | repositories, validators, utils, types |
| `repositories/` | Raw Prisma database operations | utils (prisma-client), types |
| `validators/` | Zod schemas for input validation | types |
| `utils/` | Pure helper functions, singleton clients | types |
| `components/` | Presentational React components | hooks, types, utils (client-safe only) |
| `hooks/` | Custom React hooks | types, utils (client-safe only) |
| `types/` | Type definitions & enums | Nothing (leaf module) |

**Circular dependency violations are strictly forbidden.**

---

## 6. Authentication & Authorization

- **Provider**: WorkOS AuthKit via `@workos-inc/authkit-react-router`
- **Session Management**: Encrypted HTTP-only cookies (server-side only)
- **RBAC Roles**: `ADMIN`, `ESTIMATOR`, `CLIENT`
- **Enforcement**: All protected routes must call `requireAuth()` or `requireAdmin()` from `services/workos-auth-validator.server.ts`
- **Never** expose WorkOS API keys or session tokens to the client bundle

---

## 7. Database Conventions

- **ORM**: Prisma with PostgreSQL provider
- **ID Strategy**: `cuid()` for all primary keys
- **Timestamps**: Every model includes `createdAt` and `updatedAt`
- **Naming**: Models in PascalCase, table names mapped to snake_case via `@@map`
- **Indexes**: All foreign key columns must have explicit `@@index`
- **Enums**: Defined at the Prisma schema level, mirrored in `app/types/enums.ts`

---

## 8. Environment Variables

All secrets and configuration values **must** live in `.env` (local) or environment-specific secret managers (production). Never hardcode credentials.

Required variables:
```env
DATABASE_URL=           # Supabase pooled connection (port 6543)
DIRECT_URL=             # Supabase direct connection (port 5432)
WORKOS_CLIENT_ID=       # WorkOS application client ID
WORKOS_API_KEY=         # WorkOS API secret key
WORKOS_REDIRECT_URI=    # OAuth callback URL
WORKOS_COOKIE_PASSWORD= # 32+ char random string for cookie encryption
```

---

## 9. Code Quality Standards

- **TypeScript**: Strict mode (`"strict": true`) — no `any` types without explicit justification
- **Imports**: Use `~/` path alias for all app-relative imports
- **Error Handling**: All service functions must handle errors gracefully with typed error returns
- **Comments**: Document *why*, not *what* — code should be self-documenting
- **Commits**: Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`)
