// =============================================================================
// Project Photo Sequence
// =============================================================================
// Flattens a project's phases into one ordered run of photos numbered in job
// order. The detail page groups by phase for reading, but the lightbox steps
// through this single sequence, so previous/next follows the order the work
// actually happened in rather than restarting at each phase.
// =============================================================================

import type { Project, SequencedPhoto } from "~/types/project-catalog";
import { photoWebPath } from "~/utils/photo-web-path";

export function sequenceProjectPhotos(project: Project): SequencedPhoto[] {
  let position = 0;

  return project.phases.flatMap((phase) =>
    phase.photos.map((photo) => {
      position += 1;
      return {
        ...photo,
        phaseName: phase.name,
        src: photoWebPath(project.slug, photo.file),
        position,
      };
    })
  );
}
