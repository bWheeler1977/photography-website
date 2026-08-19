"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { Photo } from "@/types";

type PhotoLightboxProps = {
  photo: Photo | null;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

export function PhotoLightbox({
  photo,
  onClose,
  onPrevious,
  onNext,
}: PhotoLightboxProps) {
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrevious?.();
      if (event.key === "ArrowRight") onNext?.();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [photo, onClose, onPrevious, onNext]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white/50 hover:bg-white/10"
            aria-label="Close photo"
          >
            Close
          </button>

          {onPrevious && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onPrevious();
              }}
              className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 p-3 text-white transition hover:border-white/50 hover:bg-white/10 sm:left-4 sm:block"
              aria-label="Previous photo"
            >
              ←
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onNext();
              }}
              className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 p-3 text-white transition hover:border-white/50 hover:bg-white/10 sm:right-4 sm:block"
              aria-label="Next photo"
            >
              →
            </button>
          )}

          <motion.div
            className="flex max-h-full w-full max-w-6xl flex-col items-center"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative max-h-[78vh] w-full">
              <Image
                src={photo.fullSrc}
                alt={photo.alt}
                width={2400}
                height={1600}
                className="mx-auto max-h-[78vh] w-auto object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                {photo.category}
              </p>
              <h2 className="mt-2 text-xl font-medium text-white sm:text-2xl">
                {photo.title}
              </h2>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
