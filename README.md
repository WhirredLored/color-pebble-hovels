# Huestone Homes LLC

Production web application for **Huestone Homes LLC**, specializing in architectural exterior painting, siding restoration, custom milled sills, cornices, and wood preservation.

Built with **React 19**, **React Router 8** (SSR framework mode), **Vite 8**, **Tailwind CSS 4**, and targeted for deployment on **Cloudflare Workers** with portfolio photography hosted on **Cloudflare R2** and authentication / inquiry storage managed via **Supabase**.

---

## Architecture Overview

- **Frontend & Routing:** React 19 + React Router 8 with Server-Side Rendering (SSR).
- **Styling:** Tailwind CSS 4 with custom typography (`Public Sans` & `Source Serif 4`) and curated earth-tone palette.
- **Compute Runtime:** [Cloudflare Workers](https://developers.cloudflare.com/workers/) using `@cloudflare/vite-plugin` and standard Web Fetch APIs.
- **Portfolio Photography:** [Cloudflare R2](https://developers.cloudflare.com/r2/) object storage (served via custom domain `photos.<your-domain>` or public R2 URL), with offline image optimization pipeline powered by Sharp.
- **Database & Auth:** [Supabase](https://supabase.com/) PostgreSQL + `@supabase/ssr` cookie-based authentication and Prisma 7 with `@prisma/adapter-pg`.

---

## Project Structure

```text
├── app/
│   ├── components/         # Reusable UI components (SiteHeader, SiteFooter, PhotoLightbox, ProjectCard, etc.)
│   ├── repositories/       # Query and mutation modules (project catalog, contact inquiries, services)
│   ├── routes/             # Route modules (home, services, projects, project detail, process, contact, sitemap, robots)
│   ├── services/           # Business logic & submission handlers
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Client & server utilities (photo web paths, Supabase, Prisma)
│   ├── root.tsx            # HTML document shell, head metadata, and global ErrorBoundary
│   ├── routes.ts           # Route declarations
│   └── app.css             # Tailwind 4 styles & CSS variables
├── public/
│   ├── images/             # Local source camera originals (2.5GB, git-ignored)
│   └── photos/             # Resized, web-optimized derivative photos (9.2MB, EXIF/GPS stripped)
├── scripts/
│   ├── build-web-images.ts # Offline Sharp pipeline generating web photos from source images
│   ├── upload-to-r2.ts     # Automated Cloudflare R2 bucket creator and photo uploader
│   └── photo-inventory.ts  # Inspection tool for EXIF timestamps and project sequencing
├── workers/
│   └── app.ts              # Cloudflare Worker entry point delegating to React Router SSR
├── wrangler.jsonc          # Cloudflare Workers & R2 configuration
├── vite.config.ts          # Vite configuration with Cloudflare and React Router plugins
└── react-router.config.ts  # React Router configuration (SSR: true)
```

---

## Getting Started

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Copy the template and configure your credentials:
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (`https://<ref>.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase public/anon API key |
| `DATABASE_URL` | PostgreSQL connection string |
| `VITE_PHOTO_CDN_URL` | (Optional) Cloudflare R2 custom domain, e.g. `https://photos.huestonehomes.com` |
| `R2_PORTFOLIO_BUCKET` | Cloudflare R2 bucket name (defaults to `huestone-portfolio`) |

---

## Development Workflow

### Start Dev Server
```bash
npm run dev
```
Starts the local development server with Hot Module Replacement (HMR) at `http://localhost:5173`.

### Typecheck
```bash
npm run typecheck
```
Generates React Router route types and runs TypeScript verification.

### Production Build
```bash
npm run build
```
Builds both client-side static assets (`build/client`) and the Cloudflare Workers SSR server bundle (`build/server`).

### Local Worker Preview
```bash
npm run preview
```
Runs the production build inside the local Cloudflare `workerd` runtime via Wrangler.

---

## Photographic Asset Pipeline (Cloudflare R2)

To keep the Git repository fast and within GitHub limits, camera originals in `public/images/` (~2.5 GB) are stored locally on disk and excluded from Git. The website serves optimized derivatives (~9.2 MB) either locally from `public/photos/` or remotely via Cloudflare R2.

### 1. Build Web Derivatives
```bash
npm run images
```
Reads source photos from `public/images/`, auto-rotates them, strips all private EXIF/GPS metadata, resizes them (1100px max edge / 1600px centerpiece), and outputs compressed MozJPEGs to `public/photos/`.

### 2. Preview R2 Upload (Dry Run)
```bash
npm run images:upload -- --dry-run
```

### 3. Upload to Cloudflare R2
```bash
npx wrangler login     # Authenticate with Cloudflare (one-time)
npm run images:upload  # Uploads all optimized assets to R2 with 1-year immutable cache headers
```

---

## Cloudflare Deployment

### Deploy from CLI
```bash
npm run deploy
```

### Continuous Deployment (Workers Builds)
1. In Cloudflare Dashboard, navigate to **Workers & Pages** > **Create application**.
2. Connect to GitHub repository: `WhirredLored/color-pebble-hovels`.
3. Set the production branch to `master`.
4. Configure Build Settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
5. Under **Settings** > **Variables and Secrets**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `DATABASE_URL`
   - `VITE_PHOTO_CDN_URL` (set once your R2 custom domain or public URL is enabled)
