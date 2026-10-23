// =============================================================================
// Project Catalog Queries
// =============================================================================
// The completed-work catalog. Photos are listed in job order within each phase,
// and the phases run in job order, so a reader moving down a project detail page
// walks the job from the first site photo to the last finished elevation.
//
// `file` values are the untouched source file names under
// public/images/<sourceDir>. Nothing here points at a served path directly —
// paths come from utils/photo-web-path, so the resized web copies in
// public/photos and the rendered <img src> cannot drift apart.
//
// Captions describe what is visible in each frame. Where a source file name and
// its photo disagree (several are named for the wall rather than the stage of
// work), the caption and the phase follow the photo.
// =============================================================================

import type { Project } from "~/types/project-catalog";

const PROJECTS: Project[] = [
  {
    slug: "farmhouse-siding-and-window-restoration",
    title: "Farmhouse siding and window restoration",
    summary:
      "Siding off two walls, rot repaired at the bay and the north wall, sills and trim cut on site, then new siding over a new weather barrier.",
    sourceDir: "Sayre-3-001",
    coverFile: "Done 3 South.jpg",
    coverIsPortrait: true,
    phases: [
      {
        name: "Before",
        photos: [
          {
            file: "Sayre Start 1 South.jpg",
            caption: "The south elevation at the start of the job.",
          },
        ],
      },
      {
        name: "Tear-off and what we found",
        photos: [
          {
            file: "North Wall Tear-off 1.JPG",
            caption:
              "Siding off the north wall, with house wrap going on over the exposed sheathing.",
          },
          {
            file: "Bay Rot 1.JPG",
            caption:
              "Rot in the framing at the bay, found once the old trim came off.",
          },
        ],
      },
      {
        name: "Structural repair",
        photos: [
          {
            file: "Bay Rot Nailer Installed 1.JPG",
            caption:
              "A new nailer fastened alongside the old framing at the bay window.",
          },
          {
            file: "Bay Sheathed 1.JPG",
            caption:
              "The bay resheathed in insulated panels, with the seams taped.",
          },
          {
            file: "North Wall Fir Out 1.JPG",
            caption:
              "The north wall wrapped and furred out to bring the new siding to a flat plane.",
          },
        ],
      },
      {
        name: "Weather barrier",
        photos: [
          {
            file: "South Wrapped 1.JPG",
            caption: "The south wall wrapped, ahead of trim and siding.",
          },
        ],
      },
      {
        name: "Millwork and trim",
        photos: [
          {
            file: "Tablesaw Profile SKILLZ 1.jpg",
            caption:
              "Cutting a trim piece on the table saw to a layout line taken off the existing profile.",
          },
          {
            file: "Bay Sills Installed 1.JPG",
            caption: "New sills installed under the bay windows.",
          },
          {
            file: "Trim Install 1.JPG",
            caption:
              "Window casing in, and the water table run along the base of the wall.",
          },
          {
            file: "Window 1 Complete 1.JPG",
            caption:
              "The first window finished: sill, side casing and head trim all in place.",
          },
          {
            file: "South Sided 1.JPG",
            caption:
              "The south wall trimmed out and ready, with the siding stacked below.",
          },
        ],
      },
      {
        name: "Siding",
        photos: [
          {
            file: "South Sided 5.JPG",
            caption:
              "New siding on the lower south wall, the upper wall still wrapped.",
          },
          {
            file: "West-South Sided 5.JPG",
            caption: "Siding carried around the west and south corner.",
          },
        ],
      },
      {
        name: "Finished",
        photos: [
          { file: "Done 1 West.jpg", caption: "West elevation, finished." },
          {
            file: "Done 2 SW.jpg",
            caption: "The south-west corner, finished.",
          },
          {
            file: "Done 3 South.jpg",
            caption:
              "The south elevation, finished — the same view as the first photo.",
          },
          { file: "Done 4 SE.jpg", caption: "The south-east corner and porch." },
          {
            file: "Done 5 East.jpg",
            caption: "East elevation, with the rebuilt bay.",
          },
          { file: "Done 6 NE.jpg", caption: "The north-east corner." },
          {
            file: "Done 7 North.jpg",
            caption:
              "North elevation, finished — the wall that was torn off and furred out.",
          },
          {
            file: "Done 8 North West.jpg",
            caption: "The north-west corner.",
          },
        ],
      },
    ],
  },
  {
    slug: "colonial-exterior-repaint",
    title: "Colonial exterior repaint",
    summary:
      "Failed paint taken back to bare wood, rotted casing and trim repaired, then primed and repainted in a darker green.",
    sourceDir: "Noyes-3-001/Noyes",
    coverFile: "West Finished 1.jpg",
    coverIsPortrait: false,
    phases: [
      {
        name: "Before",
        photos: [
          {
            file: "West Before.jpg",
            caption:
              "The west side before work, with the paint peeled back to bare wood across the siding.",
          },
          {
            file: "Rot Detail 1.jpg",
            caption: "Rotted window casing at the corner board.",
          },
          {
            file: "Front Pediment 1.jpg",
            caption:
              "The entry pediment before work: the old finish crazed, with bare wood showing through.",
          },
        ],
      },
      {
        name: "Preparation",
        photos: [
          {
            file: "West Mid 1.jpg",
            caption:
              "The west elevation part way through the job, the old paint still failing across the siding.",
          },
          {
            file: "South Prep 3.jpg",
            caption: "The south wall stripped back to bare wood.",
          },
        ],
      },
      {
        name: "Prime and paint",
        photos: [
          {
            file: "Porch Column Prime.jpg",
            caption: "Primer on the porch column, beside the old green trim.",
          },
        ],
      },
      {
        name: "Finished",
        photos: [
          {
            file: "West Finished 1.jpg",
            caption: "The west side and attached garage, finished.",
          },
          {
            file: "West Finished 3.jpg",
            caption:
              "The west elevation and entry, finished — the same view as the mid-job photo.",
          },
        ],
      },
    ],
  },
  {
    slug: "split-level-strip-and-repaint",
    title: "Split-level strip and repaint",
    summary:
      "Failing paint stripped off the siding, rotted fascia replaced, then masked, primed and sprayed.",
    sourceDir: "Steve-3-001/Steve",
    coverFile: "South Finished 1.jpg",
    coverIsPortrait: false,
    phases: [
      {
        name: "Before",
        photos: [
          {
            file: "South Before 2.jpg",
            caption: "The south side before work started.",
          },
          {
            file: "Fascia Rot 1.jpg",
            caption: "Fascia rotted through, exposed with the gutter off.",
          },
        ],
      },
      {
        name: "Preparation",
        photos: [
          {
            file: "East Strip 1.jpg",
            caption:
              "The east wall part way through stripping, down to bare wood.",
          },
          {
            file: "South Masking 1.jpg",
            caption: "The south side masked off, with the sprayer set up.",
          },
        ],
      },
      {
        name: "Prime and paint",
        photos: [
          {
            file: "North Garage Primed 1.jpg",
            caption: "The garage wall and door primed.",
          },
        ],
      },
      {
        name: "Finished",
        photos: [
          {
            file: "South Finished 1.jpg",
            caption:
              "The south side, finished — the same view as the first photo.",
          },
        ],
      },
    ],
  },
];

/**
 * The single photo used as the home page centerpiece. Called out separately
 * because it is the one image generated at a larger size than the rest.
 */
export const HOME_CENTERPIECE = {
  projectSlug: "farmhouse-siding-and-window-restoration",
  file: "Done 3 South.jpg",
} as const;

export function getAllProjects(): Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | null {
  return PROJECTS.find((project) => project.slug === slug) ?? null;
}
