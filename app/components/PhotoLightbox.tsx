import { useEffect, useRef } from "react";

import type { SequencedPhoto } from "~/types/project-catalog";

interface PhotoLightboxProps {
  photos: SequencedPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function PhotoLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: PhotoLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const photo = photos[index];
  const hasPrevious = index > 0;
  const hasNext = index < photos.length - 1;

  useEffect(() => {
    dialogRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
      if (event.key === "ArrowRight" && index < photos.length - 1) {
        onIndexChange(index + 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, photos.length, onIndexChange, onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${photo.position} of ${photos.length}`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-[rgba(22,35,58,0.96)] p-4 outline-none"
    >
      <div className="flex items-center justify-between gap-4 text-sm text-white">
        <span>
          Photo {photo.position} of {photos.length} · {photo.phaseName}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-[3px] border border-white/40 px-3 py-1.5 hover:border-white"
        >
          Close
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <img
          src={photo.src}
          alt={photo.caption}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-white">
        <button
          type="button"
          onClick={() => onIndexChange(index - 1)}
          disabled={!hasPrevious}
          className="rounded-[3px] border border-white/40 px-3 py-1.5 enabled:hover:border-white disabled:opacity-40"
        >
          Previous
        </button>
        <p className="min-w-0 flex-1 text-center">{photo.caption}</p>
        <button
          type="button"
          onClick={() => onIndexChange(index + 1)}
          disabled={!hasNext}
          className="rounded-[3px] border border-white/40 px-3 py-1.5 enabled:hover:border-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
