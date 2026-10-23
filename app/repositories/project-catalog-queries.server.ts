// =============================================================================
// Project Catalog Queries
// =============================================================================
// The completed-work catalog. Photos are grouped by stage of work, and within
// each stage they run in the order they were taken, so a reader moving down a
// project detail page walks the job from the first site photo to the last
// finished elevation.
//
// Order follows the EXIF capture time of the originals, not the file names —
// many files are named for the wall rather than the stage, and the crew worked
// the house in overlapping passes rather than one wall at a time. Run
// `npx tsx scripts/photo-inventory.ts <album>` to see that timeline.
//
// `file` values are the untouched source file names under
// public/images/<sourceDir>. Nothing here points at a served path directly —
// paths come from utils/photo-web-path, so the resized web copies in
// public/photos and the rendered <img src> cannot drift apart.
// =============================================================================

import type { Project } from "~/types/project-catalog";

const PROJECTS: Project[] = [
  {
    slug: "farmhouse-siding-and-window-restoration",
    title: "Farmhouse re-side with milled sills and cornices",
    summary:
      "Full cedar lap siding removal under lead containment, then LP SmartSide and paint. Eighteen windowsills were milled on site, each with a matching cornice fabricated to suit. April to October 2025.",
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
          {
            file: "Sayre Start 2 South East.jpg",
            caption: "The front porch and entry.",
          },
          {
            file: "Sayre Start 3 East-South.jpg",
            caption: "The porch and bay from the south-east.",
          },
          {
            file: "Sayre Start 4 East.jpg",
            caption: "The east elevation, with the bay.",
          },
          {
            file: "Sayre Start 5 East-North.jpg",
            caption: "The east side, looking north to the back door.",
          },
          {
            file: "Sayre Start 6 North-East.jpg",
            caption: "The north-east corner, with the garage at right.",
          },
          { file: "Sayre Start 7 West.jpg", caption: "The west elevation." },
          {
            file: "Sayre Start 8 West-South.jpg",
            caption: "The west side, looking south.",
          },
          {
            file: "Sayre Start 9.jpg",
            caption:
              "The old cedar lap siding at a window head, broken away where it met the casing.",
          },
          {
            file: "Sayre Start 10.jpg",
            caption:
              "The old head casing, with the paint built up and cracked through.",
          },
        ],
      },
      {
        name: "Tear-off",
        photos: [
          {
            file: "North Wall Tear-off 1.JPG",
            caption:
              "The north wall with the cedar off and house wrap going up over the sheathing.",
          },
          {
            file: "North Wall Tear-off 2.JPG",
            caption: "The same wall a few days on, the wrap carried further across.",
          },
          {
            file: "Bay Fascia Tear-off 1.JPG",
            caption: "The bay fascia off, with the roof edge opened up.",
          },
        ],
      },
      {
        name: "What we found",
        photos: [
          {
            file: "Bay Rot 1.JPG",
            caption: "Rot in the framing at the bay, once the old trim came off.",
          },
          {
            file: "Bay Rot 2.JPG",
            caption:
              "Further along the same sill: the timber gone punky, with the insulation open to the weather.",
          },
          {
            file: "Bay Rot 12.jpg",
            caption:
              "Behind the bay siding, the sheathing boards rotted and opened up at the joints.",
          },
          {
            file: "Bay Rot 14.jpg",
            caption:
              "The bay opened up at the roof line, with the old framing exposed.",
          },
          {
            file: "North Wall Rot 3.jpg",
            caption:
              "The foot of the old board siding on the north wall, rotted through beside the service line.",
          },
          {
            file: "Nort Wall Rot 1.jpg",
            caption:
              "At the porch roof, the base of the wall dark and soft behind the wrap.",
          },
          {
            file: "North Wall rot 2.jpg",
            caption: "Water staining at the sill plate, found with the wrap pulled back.",
          },
          {
            file: "NW Corner Rot 1.jpg",
            caption:
              "The north-west corner opened up: the corner post black and soft behind the siding.",
          },
          {
            file: "NW Corner Rot 2.jpg",
            caption:
              "The same corner from the door side, with the old sheathing exposed.",
          },
        ],
      },
      {
        name: "Weather barrier",
        photos: [
          {
            file: "West Wrapped 1.JPG",
            caption: "The west wall wrapped, with the old siding gone.",
          },
          {
            file: "South Wrapped 1.JPG",
            caption: "The south wall wrapped, ahead of trim and siding.",
          },
          {
            file: "East Wrapped 1.JPG",
            caption:
              "The porch wall wrapped while the upper east wall waits, the old cedar still exposed under sheeting.",
          },
          {
            file: "East-North Wrapped 1.JPG",
            caption:
              "Sheeting hung over the upper east and north walls during tear-off.",
          },
          {
            file: "Front Sill Upper Tearout.JPG",
            caption:
              "The south wall wrapped, with ladders set to take out the upper front sill.",
          },
        ],
      },
      {
        name: "Millwork on site",
        photos: [
          {
            file: "Testing sill Bit 1.jpg",
            caption: "Testing the sill bit: the milled profile on a test piece.",
          },
          {
            file: "Windowsill !st fit 1.jpg",
            caption: "A new sill offered up to the opening for a first fit.",
          },
          {
            file: "Bay Sills Layout 1.jpg",
            caption:
              "Laying out a bay sill from measurements taken off the opening.",
          },
          {
            file: "North Wall Fir Out Layout 1.jpg",
            caption: "Stud lines marked on the wrap before furring out the north wall.",
          },
          {
            file: "North Window buildout 1.jpg",
            caption: "A window buildout frame made up on site before it went on the wall.",
          },
          {
            file: "Tablesaw Profile SKILLZ 1.jpg",
            caption:
              "Cutting a profile on the table saw to a layout line taken off the original.",
          },
          {
            file: "DSCF0113.JPG",
            caption: "The cut station set up in the yard.",
          },
          {
            file: "Saw Station 1.JPG",
            caption: "The saw bench and stock, set up for the run of the job.",
          },
          {
            file: "Back Porch Windows (1).jpg",
            caption: "A back porch sash taken out and brought in to the bench.",
          },
          {
            file: "Gable above Bay Calculated Cuts 1.jpg",
            caption:
              "Siding for the gable above the bay, every piece cut to its own angle.",
          },
          {
            file: "Colonial Corner Caps (1).jpg",
            caption: "Colonial corner caps made up and mitred, ready to go on.",
          },
        ],
      },
      {
        name: "Structural repair",
        photos: [
          {
            file: "Bay Rot Nailer Installed 1.JPG",
            caption: "A new nailer fastened alongside the old framing at the bay.",
          },
          {
            file: "Bay Sheathed 1.JPG",
            caption: "The bay resheathed in insulated panels, with the seams taped.",
          },
          {
            file: "Bay Sheathed 8.JPG",
            caption: "The bay closed in and taped, windows back in.",
          },
          {
            file: "North Wall Fir Out 1.JPG",
            caption:
              "The north wall wrapped and furred out to bring the new siding to a flat plane.",
          },
          {
            file: "North Wall Fir Out 3.JPG",
            caption: "Furring over the wrap, with a new sill set under the window.",
          },
          {
            file: "North Window buildout Install 1.JPG",
            caption: "The buildout frame in around the north window.",
          },
          {
            file: "North Window buildout Install 3.JPG",
            caption: "The north twin window cased out, with its new sill under.",
          },
          {
            file: "Gable Vent Opening.jpg",
            caption: "The gable vent opening, measured up for a new vent.",
          },
        ],
      },
      {
        name: "Sills, trim and cornices installed",
        photos: [
          {
            file: "Front Sills Installed.JPG",
            caption: "The south wall with both front sills in.",
          },
          {
            file: "Front Sill Upper Installed.JPG",
            caption:
              "The upper front sill, its milled nose running out to a returned end.",
          },
          {
            file: "Bay Sills Installed 1.JPG",
            caption: "New sills under the bay windows.",
          },
          {
            file: "Bay Sills Installed 9.JPG",
            caption: "The bay with sills and side casings fitted.",
          },
          {
            file: "North East Upper Sill Installed 1.JPG",
            caption: "The north-east upper window with its new sill and casing.",
          },
          {
            file: "Trim Install 1.JPG",
            caption:
              "Window casing in, and the water table run along the base of the wall.",
          },
          {
            file: "Trim Install 3.JPG",
            caption: "A trim band run along the wall under the eave.",
          },
          {
            file: "Window Head Casing 1.JPG",
            caption: "A new head cornice set over a window, seen from the ladder.",
          },
          {
            file: "Window 1 Complete 1.JPG",
            caption:
              "The first window finished: sill, side casing and head cornice all in place.",
          },
          {
            file: "Window Head Casing 3.JPG",
            caption: "The head cornice detail against the new siding.",
          },
          {
            file: "Tablesaw Profile SKILLZ 5.JPG",
            caption:
              "The siding cut to follow the cornice profile, cut by cut, where the two meet.",
          },
          {
            file: "South-East Door Casing 1.JPG",
            caption: "New siding on the porch wall, with the door still to be cased.",
          },
          {
            file: "Bay Fascia Install 1.JPG",
            caption: "New fascia on the bay, with a cornice over the window below.",
          },
          {
            file: "IMG20250910140325.jpg",
            caption:
              "A finished cornice over a window, with the siding run up to it and the gauge still hung on the wall.",
          },
        ],
      },
      {
        name: "SmartSide and paint",
        photos: [
          {
            file: "West Sided 1.JPG",
            caption: "The first courses of SmartSide on the west wall.",
          },
          {
            file: "West Sided 2.JPG",
            caption: "The west wall, siding up to the first floor line.",
          },
          {
            file: "West-South Sided 1.JPG",
            caption: "Siding turning the corner from west to south.",
          },
          {
            file: "West-South Sided 2.JPG",
            caption: "Both walls sided up the first storey at the west and south corner.",
          },
          {
            file: "South Sided 1.JPG",
            caption:
              "The south wall trimmed out and ready, with the siding stacked below.",
          },
          {
            file: "South Sided 3.JPG",
            caption: "The south wall sided to the first floor line, the gable still wrapped.",
          },
          {
            file: "South Sided 5.JPG",
            caption: "The south wall further along, the upper wall still to go.",
          },
          {
            file: "West Sided 3.JPG",
            caption: "The west wall nearly closed in, with only the gable left.",
          },
          {
            file: "West-South Sided 3.JPG",
            caption: "The west wall at dusk, with the next section still to come.",
          },
          {
            file: "West-South Sided 5.JPG",
            caption: "Siding carried around the west and south corner.",
          },
          {
            file: "South-East Sided 1.JPG",
            caption: "The porch sided and the door cased out.",
          },
          {
            file: "East-South Sided 1.JPG",
            caption: "The wall above the porch sided, with the bay section still to go.",
          },
        ],
      },
      {
        name: "Finished",
        photos: [
          { file: "Done 1 West.jpg", caption: "West elevation, finished." },
          { file: "Done 2 SW.jpg", caption: "The south-west corner, finished." },
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
          { file: "Done 8 North West.jpg", caption: "The north-west corner." },
        ],
      },
    ],
  },
  {
    slug: "colonial-exterior-repaint",
    title: "Historic redwood repaint",
    summary:
      "Repaint of a historic red heartwood exterior. The south and east sides were stripped in full, then given two coats of primer before paint.",
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
            caption:
              "The south wall stripped in full, back to bare red heartwood.",
          },
        ],
      },
      {
        name: "Prime and paint",
        photos: [
          {
            file: "Porch Column Prime.jpg",
            caption:
              "Primer on the porch column, beside the old green trim. The stripped sides took two coats before paint.",
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
    title: "Split-level redwood repaint",
    summary:
      "A full paint shave on knotty redwood siding. Nail holes filled, sanded, then two coats of primer and two of paint.",
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
              "The east wall part way through the paint shave, down to bare redwood.",
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
            caption:
              "The garage wall and door primed. Everything took two coats of primer and two of paint.",
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
