// =============================================================================
// Photo Inventory
// =============================================================================
// Reads a source album, de-duplicates by file content, pulls the EXIF capture
// time off each photo and prints them in the order they were taken. Used to
// work out how a job actually progressed before arranging it on the site.
//
// Run with: npx tsx scripts/photo-inventory.ts <folder-under-public/images>
// =============================================================================

import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";

const SOURCE_ROOT = path.join(process.cwd(), "public", "images");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

interface Entry {
  file: string;
  hash: string;
  takenAt: Date | null;
  width: number | null;
  height: number | null;
  bytes: number;
  aliases: string[];
}

async function walk(dir: string, base = ""): Promise<string[]> {
  const found: string[] = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const relative = base ? path.join(base, item.name) : item.name;
    if (item.isDirectory()) {
      found.push(...(await walk(path.join(dir, item.name), relative)));
    } else if (IMAGE_EXTENSIONS.has(path.extname(item.name).toLowerCase())) {
      found.push(relative);
    }
  }
  return found;
}

/** Descriptive names beat camera-roll names when the same photo has both. */
function nameScore(file: string) {
  const base = path.basename(file);
  if (/^(DSCF|PXL_|IMG)/i.test(base)) return 0;
  return 1;
}

async function main() {
  const album = process.argv[2];
  if (!album) {
    console.error("Usage: tsx scripts/photo-inventory.ts <album-folder>");
    process.exitCode = 1;
    return;
  }

  const albumRoot = path.join(SOURCE_ROOT, album);
  const files = await walk(albumRoot);
  const byHash = new Map<string, Entry>();

  for (const file of files) {
    const full = path.join(albumRoot, file);
    const buffer = await readFile(full);
    const hash = createHash("md5").update(buffer).digest("hex");

    const existing = byHash.get(hash);
    if (existing) {
      existing.aliases.push(file);
      if (nameScore(file) > nameScore(existing.file)) {
        existing.aliases.push(existing.file);
        existing.file = file;
        existing.aliases = existing.aliases.filter((a) => a !== file);
      }
      continue;
    }

    let takenAt: Date | null = null;
    let width: number | null = null;
    let height: number | null = null;
    try {
      const exif = await exifr.parse(buffer, {
        pick: ["DateTimeOriginal", "CreateDate", "ExifImageWidth", "ExifImageHeight"],
      });
      takenAt = exif?.DateTimeOriginal ?? exif?.CreateDate ?? null;
      width = exif?.ExifImageWidth ?? null;
      height = exif?.ExifImageHeight ?? null;
    } catch {
      // Leave the fields null; the file is still listed.
    }

    byHash.set(hash, {
      file,
      hash,
      takenAt,
      width,
      height,
      bytes: (await stat(full)).size,
      aliases: [],
    });
  }

  const entries = [...byHash.values()].sort((a, b) => {
    if (a.takenAt && b.takenAt) return a.takenAt.getTime() - b.takenAt.getTime();
    if (a.takenAt) return -1;
    if (b.takenAt) return 1;
    return a.file.localeCompare(b.file);
  });

  console.log(`${files.length} files, ${entries.length} unique photos\n`);

  let lastDay = "";
  for (const entry of entries) {
    const day = entry.takenAt
      ? entry.takenAt.toISOString().slice(0, 10)
      : "no-exif-date";
    if (day !== lastDay) {
      console.log(`\n--- ${day} ---`);
      lastDay = day;
    }
    const time = entry.takenAt
      ? entry.takenAt.toISOString().slice(11, 16)
      : "     ";
    const orientation =
      entry.width && entry.height
        ? entry.width > entry.height
          ? "landscape"
          : "portrait "
        : "         ";
    const dupes = entry.aliases.length ? `  [+${entry.aliases.length} dupe]` : "";
    console.log(`${time}  ${orientation}  ${entry.file}${dupes}`);
  }
}

await main();
