// =============================================================================
// Cloudflare R2 Portfolio Photography Uploader
// =============================================================================
// Uploads optimized web photography from public/photos into the Cloudflare R2
// bucket (default: huestone-portfolio), preserving the photos/<project>/<file>
// key structure that app/utils/photo-web-path.ts produces.
//
// Only public/photos is uploaded. Camera originals in public/images are never
// read or uploaded by this script.
//
// Usage:
//   npm run images:upload              # Uploads all optimized photos
//   npm run images:upload -- --dry-run # Shows what would be uploaded
// =============================================================================

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { exec, execSync } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const BUCKET_NAME = process.env.R2_PORTFOLIO_BUCKET || "huestone-portfolio";
const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");
const CONCURRENCY = 6;

// Filenames are not content-hashed, so a replaced photo keeps the same URL.
// A one-day browser/edge TTL keeps delivery fast while letting replacements
// propagate without a manual purge. Never use `immutable` here.
const CACHE_CONTROL = "public, max-age=86400";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

interface FileToUpload {
  localPath: string;
  r2Key: string;
  sizeBytes: number;
  contentType: string;
}

async function findPhotos(dir: string, baseDir: string = dir): Promise<FileToUpload[]> {
  const results: FileToUpload[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findPhotos(fullPath, baseDir)));
      continue;
    }
    const contentType = CONTENT_TYPES[path.extname(entry.name).toLowerCase()];
    if (entry.isFile() && contentType) {
      const relative = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      const fileStat = await stat(fullPath);
      results.push({
        localPath: fullPath,
        r2Key: `photos/${relative}`,
        sizeBytes: fileStat.size,
        contentType,
      });
    }
  }

  return results;
}

function checkWranglerAuth(): boolean {
  try {
    const output = execSync("npx wrangler whoami", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return !output.includes("You are not authenticated");
  } catch {
    return false;
  }
}

async function uploadOne(photo: FileToUpload): Promise<void> {
  // --remote is required: Wrangler v4 defaults r2 object commands to the
  // LOCAL simulator, which would silently "succeed" without uploading.
  await execAsync(
    `npx wrangler r2 object put "${BUCKET_NAME}/${photo.r2Key}" --remote ` +
      `--file "${photo.localPath}" --content-type "${photo.contentType}" ` +
      `--cache-control "${CACHE_CONTROL}"`,
    { maxBuffer: 10 * 1024 * 1024 }
  );
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log(`\n======================================================`);
  console.log(` Huestone Homes — Cloudflare R2 Portfolio Uploader`);
  console.log(` Target Bucket: ${BUCKET_NAME} (remote)`);
  console.log(` Source Folder: ${PHOTOS_DIR}`);
  console.log(` Cache-Control: ${CACHE_CONTROL}`);
  console.log(` Mode:          ${isDryRun ? "DRY RUN (no uploads performed)" : "LIVE UPLOAD"}`);
  console.log(`======================================================\n`);

  try {
    await stat(PHOTOS_DIR);
  } catch {
    console.error(`Error: Photos directory not found at ${PHOTOS_DIR}`);
    console.error(`Run 'npm run images' first to generate optimized web copies.`);
    process.exit(1);
  }

  const photos = await findPhotos(PHOTOS_DIR);
  const totalMB = (photos.reduce((acc, p) => acc + p.sizeBytes, 0) / (1024 * 1024)).toFixed(2);
  console.log(`Discovered ${photos.length} optimized photos (${totalMB} MB total)\n`);

  if (isDryRun) {
    for (const photo of photos) {
      console.log(`  [dry-run] ${photo.r2Key} (${photo.contentType}, ${Math.round(photo.sizeBytes / 1024)} KB)`);
    }
    console.log(`\nDry run complete. Run without --dry-run to upload.`);
    return;
  }

  if (!checkWranglerAuth()) {
    console.error(`\nNot logged in to Cloudflare. Run 'npx wrangler login', then re-run.`);
    process.exit(1);
  }

  const queue = [...photos];
  const failures: string[] = [];
  let uploaded = 0;

  async function worker() {
    for (let photo = queue.shift(); photo; photo = queue.shift()) {
      try {
        await uploadOne(photo);
        uploaded++;
        console.log(`  [${uploaded}/${photos.length}] ${photo.r2Key}`);
      } catch (err: unknown) {
        failures.push(photo.r2Key);
        console.error(`  FAILED ${photo.r2Key}: ${(err as Error).message.split("\n").slice(-3).join(" ")}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`\nUpload complete: ${uploaded}/${photos.length} photos uploaded to R2 bucket '${BUCKET_NAME}'.`);
  if (failures.length > 0) {
    console.error(`${failures.length} upload(s) failed:\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
