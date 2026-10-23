// =============================================================================
// Photo Web Path Resolution
// =============================================================================
// Single source of truth for where a resized web copy of a source photo lives.
// Both the site and scripts/build-web-images.ts derive paths from here, so the
// generated files and the rendered <img src> can never drift apart.
// =============================================================================

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
  return `/photos/${projectSlug}/${photoFileSlug(sourceFile)}.jpg`;
}

/** Public URL of the larger copy, generated only for the home centerpiece. */
export function photoWebPathLarge(
  projectSlug: string,
  sourceFile: string
): string {
  return `/photos/${projectSlug}/${photoFileSlug(sourceFile)}-1600.jpg`;
}
