// =============================================================================
// Project Catalog Types
// =============================================================================
// Shape of the completed-work catalog rendered on the Projects pages.
// Leaf module: imports nothing.
// =============================================================================

export interface ProjectPhoto {
  /** File name exactly as it appears in the untouched source album. */
  file: string;
  caption: string;
}

export interface ProjectPhase {
  name: string;
  photos: ProjectPhoto[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  /** Folder under public/images holding the untouched originals. */
  sourceDir: string;
  /** Source file used for the project card and the detail page lead image. */
  coverFile: string;
  /** True when the cover is portrait and must not be cropped to a landscape box. */
  coverIsPortrait: boolean;
  phases: ProjectPhase[];
}

/** A photo flattened out of its phase, carrying its number in job order. */
export interface SequencedPhoto extends ProjectPhoto {
  /** 1-based position across the whole project, in job order. */
  position: number;
  phaseName: string;
  src: string;
}
