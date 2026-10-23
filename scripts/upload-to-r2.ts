// =============================================================================
// Cloudflare R2 Portfolio Photography Uploader
// =============================================================================
// Uploads optimized web photography from public/photos into the Cloudflare R2
// bucket (default: huestone-portfolio).
//
// Usage:
//   npm run images:upload           # Uploads all optimized photos
//   npm run images:upload --dry-run # Shows what would be uploaded
// =============================================================================

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const BUCKET_NAME = process.env.R2_PORTFOLIO_BUCKET || "huestone-portfolio";
const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");

interface FileToUpload {
  localPath: string;
  r2Key: string;
  sizeBytes: number;
}

async function findPhotos(dir: string, baseDir: string = dir): Promise<FileToUpload[]> {
  const results: FileToUpload[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await findPhotos(fullPath, baseDir);
      results.push(...nested);
    } else if (entry.isFile() && /\.(jpg|jpeg|webp|png)$/i.test(entry.name)) {
      const relative = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      const fileStat = await stat(fullPath);
      results.push({
        localPath: fullPath,
        r2Key: `photos/${relative}`,
        sizeBytes: fileStat.size,
      });
    }
  }

  return results;
}

async function checkWranglerAuth(): Promise<boolean> {
  try {
    const output = execSync("npx wrangler whoami", { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
    return !output.includes("You are not authenticated");
  } catch {
    return false;
  }
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log(`\n======================================================`);
  console.log(` Huestone Homes — Cloudflare R2 Portfolio Uploader`);
  console.log(` Target Bucket: ${BUCKET_NAME}`);
  console.log(` Source Folder: ${PHOTOS_DIR}`);
  console.log(` Mode:          ${isDryRun ? "DRY RUN (no uploads performed)" : "LIVE UPLOAD"}`);
  console.log(`======================================================\n`);

  try {
    await stat(PHOTOS_DIR);
  } catch {
    console.error(`Error: Photos directory not found at ${PHOTOS_DIR}`);
    console.error(`Please run 'npm run images' first to generate optimized web copies.`);
    process.exit(1);
  }

  const photos = await findPhotos(PHOTOS_DIR);
  const totalMB = (photos.reduce((acc, p) => acc + p.sizeBytes, 0) / (1024 * 1024)).toFixed(2);

  console.log(`Discovered ${photos.length} optimized photos (${totalMB} MB total)\n`);

  if (isDryRun) {
    console.log(`Files ready for Cloudflare R2:`);
    for (const photo of photos) {
      console.log(`  [dry-run] ${photo.r2Key} (${Math.round(photo.sizeBytes / 1024)} KB)`);
    }
    console.log(`\nDry run complete. Run without --dry-run to upload.`);
    return;
  }

  const authenticated = await checkWranglerAuth();
  if (!authenticated) {
    console.error(`\n⚠️  Authentication Required:`);
    console.error(`You are not logged in to Cloudflare on this machine.`);
    console.error(`Run the following command to authenticate, then re-run this script:`);
    console.error(`\n    npx wrangler login\n`);
    console.error(`Once authenticated, this script will upload to bucket '${BUCKET_NAME}'.`);
    process.exit(1);
  }

  // Ensure bucket exists
  try {
    console.log(`Checking/creating R2 bucket '${BUCKET_NAME}'...`);
    execSync(`npx wrangler r2 bucket create ${BUCKET_NAME}`, { stdio: "ignore" });
  } catch {
    // Bucket already exists or user has existing permissions
  }

  let uploaded = 0;
  for (const photo of photos) {
    const contentType = photo.localPath.endsWith(".webp") ? "image/webp" : "image/jpeg";
    const destination = `${BUCKET_NAME}/${photo.r2Key}`;
    console.log(`Uploading (${uploaded + 1}/${photos.length}): ${photo.r2Key}...`);

    try {
      execSync(
        `npx wrangler r2 object put "${destination}" --file "${photo.localPath}" --content-type "${contentType}" --cache-control "public, max-age=31536000, immutable"`,
        { stdio: "pipe" }
      );
      uploaded++;
    } catch (err: unknown) {
      console.error(`Failed to upload ${photo.r2Key}:`, (err as Error).message);
    }
  }

  console.log(`\n Upload complete: ${uploaded}/${photos.length} photos uploaded to R2 bucket '${BUCKET_NAME}'.`);
  console.log(`To serve via custom domain, configure 'photos.<your-domain>' in Cloudflare R2 dashboard.`);
  console.log(`Then set environment variable: VITE_PHOTO_CDN_URL=https://photos.<your-domain>\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
