import { useState } from "react";

import { PhotoLightbox } from "~/components/PhotoLightbox";
import type { SequencedPhoto } from "~/types/project-catalog";

interface ProjectPhotoGalleryProps {
  photos: SequencedPhoto[];
}

interface PhaseGroup {
  name: string;
  photos: SequencedPhoto[];
}

/** Groups an already-ordered run of photos back into its phases. */
function groupByPhase(photos: SequencedPhoto[]): PhaseGroup[] {
  const groups: PhaseGroup[] = [];

  for (const photo of photos) {
    const current = groups.at(-1);
    if (current && current.name === photo.phaseName) {
      current.photos.push(photo);
    } else {
      groups.push({ name: photo.phaseName, photos: [photo] });
    }
  }

  return groups;
}

export function ProjectPhotoGallery({ photos }: ProjectPhotoGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const groups = groupByPhase(photos);

  return (
    <>
      {groups.map((group) => (
        <section key={group.name} className="mt-12">
          <h2 className="border-b border-rule pb-2 font-serif text-xl">
            {group.name}
          </h2>

          <ul className="mt-6 grid gap-8 sm:grid-cols-2">
            {group.photos.map((photo) => (
              <li key={photo.src}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(photo.position - 1)}
                  className="block w-full text-left"
                >
                  <span className="block aspect-4/3 w-full border border-rule bg-panel">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="mt-2 block text-sm text-body">
                    <span className="text-muted">{photo.position}.</span>{" "}
                    {photo.caption}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {openIndex !== null && (
        <PhotoLightbox
          photos={photos}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
