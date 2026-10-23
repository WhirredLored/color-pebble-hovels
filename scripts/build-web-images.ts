// =============================================================================
// Web Image Build
// =============================================================================
// Writes resized, EXIF-rotated web copies of the project photos into
// public/photos. The originals in public/images are read only and never
// modified. Run with: npm run images
// =============================================================================

import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import {
  getAllProjects,
  HOME_CENTERPIECE,
} from "../app/repositories/project-catalog-queries.server";
import { photoWebPath, photoWebPathLarge } from "../app/utils/photo-web-path";

const SOURCE_ROOT = path.join(process.cwd(), "public", "images");
const PUBLIC_ROOT = path.join(process.cwd(), "public");

/** Turns a served path such as /photos/a/b.jpg into its file on disk. */
function toDiskPath(webPath: string) {
  return path.join(PUBLIC_ROOT, webPath);
}

const LONG_EDGE = 1100;
const CENTERPIECE_LONG_EDGE = 1600;
const JPEG_QUALITY = 75;

async function resize(source: string, destination: string, longEdge: number) {
  await sharp(source)
    .rotate()
    .resize({ width: longEdge, height: longEdge, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(destination);
}

/** True when the destination is already newer than its source. */
async function isUpToDate(source: string, destination: string) {
  try {
    const [sourceStat, destinationStat] = await Promise.all([
      stat(source),
      stat(destination),
    ]);
    return destinationStat.mtimeMs >= sourceStat.mtimeMs;
  } catch {
    return false;
  }
}

async function main() {
  const force = process.argv.includes("--force");
  let written = 0;
  let skipped = 0;
  const missing: string[] = [];

  for (const project of getAllProjects()) {
    const files = project.phases.flatMap((phase) =>
      phase.photos.map((photo) => photo.file)
    );

    for (const file of new Set([...files, project.coverFile])) {
      const source = path.join(SOURCE_ROOT, project.sourceDir, file);

      const isCenterpiece =
        project.slug === HOME_CENTERPIECE.projectSlug &&
        file === HOME_CENTERPIECE.file;

      const targets = [
        {
          destination: toDiskPath(photoWebPath(project.slug, file)),
          longEdge: LONG_EDGE,
        },
        ...(isCenterpiece
          ? [
              {
                destination: toDiskPath(photoWebPathLarge(project.slug, file)),
                longEdge: CENTERPIECE_LONG_EDGE,
              },
            ]
          : []),
      ];

      try {
        await stat(source);
      } catch {
        missing.push(path.join(project.sourceDir, file));
        continue;
      }

      for (const target of targets) {
        if (!force && (await isUpToDate(source, target.destination))) {
          skipped += 1;
          continue;
        }
        await mkdir(path.dirname(target.destination), { recursive: true });
        await resize(source, target.destination, target.longEdge);
        written += 1;
        console.log(`wrote ${path.relative(process.cwd(), target.destination)}`);
      }
    }
  }

  console.log(`\n${written} written, ${skipped} already up to date`);

  if (missing.length > 0) {
    console.error(`\nMissing source files:\n${missing.map((m) => `  ${m}`).join("\n")}`);
    process.exitCode = 1;
  }
}

await main();
