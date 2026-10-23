// =============================================================================
// Photo Web Path Resolution
// =============================================================================
// Single source of truth for where a resized web copy of a source photo lives.
// Both the site and scripts/build-web-images.ts derive paths from here, so the
// generated files and the rendered <img src> can never drift apart.
//
// Supports optional Cloudflare R2 / CDN base URL via VITE_PHOTO_CDN_URL.
// When VITE_PHOTO_CDN_URL is set (e.g., "https://photos.huestonehomes.com" or
// "https://pub-<hash>.r2.dev"), images load from Cloudflare R2.
// When unset, falls back seamlessly to the local public static asset path.
// =============================================================================

function getPhotoCdnBase(): string {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_PHOTO_CDN_URL) {
    return import.meta.env.VITE_PHOTO_CDN_URL.replace(/\/+$/, "");
  }
  if (typeof process !== "undefined" && process.env?.VITE_PHOTO_CDN_URL) {
    return process.env.VITE_PHOTO_CDN_URL.replace(/\/+$/, "");
  }
  return "";
}

/** Strips the extension and reduces a source file name to a URL-safe slug. */
export function photoFileSlug(sourceFile: string): string {
  return sourceFile
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Public URL of the resized web copy of a source photo. */
export function photoWebPath(projectSlug: string, sourceFile: string): string {
  const base = getPhotoCdnBase();
  return `${base}/photos/${projectSlug}/${photoFileSlug(sourceFile)}.jpg`;
}

/** Public URL of the larger copy, generated only for the home centerpiece. */
export function photoWebPathLarge(
  projectSlug: string,
  sourceFile: string
): string {
  const base = getPhotoCdnBase();
  return `${base}/photos/${projectSlug}/${photoFileSlug(sourceFile)}-1600.jpg`;
}
