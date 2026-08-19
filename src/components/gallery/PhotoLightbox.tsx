"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/types";

type PhotoLightboxProps = {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
};

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = src;
  });
}

export function PhotoLightbox({ photos, index, onClose }: PhotoLightboxProps) {
  const [displayedIndex, setDisplayedIndex] = useState<number | null>(index);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayedPhoto =
    displayedIndex !== null ? photos[displayedIndex] ?? null : null;

  useEffect(() => {
    if (index === null) {
      setDisplayedIndex(null);
      setIsBlurred(false);
      setIsLoading(false);
      return;
    }

    setDisplayedIndex(index);
    setIsBlurred(true);
    setIsLoading(false);
  }, [index]);

  useEffect(() => {
    if (displayedIndex === null || photos.length === 0) return;

    const preloadAdjacent = (targetIndex: number) => {
      const src = photos[targetIndex]?.fullSrc;
      if (src) preloadImage(src).catch(() => undefined);
    };

    preloadAdjacent((displayedIndex + 1) % photos.length);
    preloadAdjacent((displayedIndex - 1 + photos.length) % photos.length);
  }, [displayedIndex, photos]);

  const goTo = useCallback(
    async (targetIndex: number) => {
      if (
        displayedIndex === null ||
        targetIndex === displayedIndex ||
        isLoading ||
        !photos[targetIndex]
      ) {
        return;
      }

      setIsLoading(true);
      setIsBlurred(true);

      try {
        await preloadImage(photos[targetIndex].fullSrc);
        setDisplayedIndex(targetIndex);
      } catch {
        setDisplayedIndex(targetIndex);
        setIsLoading(false);
        setIsBlurred(false);
      }
    },
    [displayedIndex, isLoading, photos],
  );

  const showPrevious = useCallback(() => {
    if (displayedIndex === null || photos.length <= 1) return;
    goTo((displayedIndex - 1 + photos.length) % photos.length);
  }, [displayedIndex, goTo, photos.length]);

  const showNext = useCallback(() => {
    if (displayedIndex === null || photos.length <= 1) return;
    goTo((displayedIndex + 1) % photos.length);
  }, [displayedIndex, goTo, photos.length]);

  useEffect(() => {
    if (!displayedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [displayedPhoto, onClose, showNext, showPrevious]);

  const handleImageLoad = () => {
    setIsBlurred(false);
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {displayedPhoto && displayedIndex !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={displayedPhoto.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-white/50 hover:bg-white/10"
            aria-label="Close photo"
          >
            Close
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                disabled={isLoading}
                className="absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 p-3 text-white transition hover:border-white/50 hover:bg-white/10 disabled:opacity-40 sm:left-4 sm:block"
                aria-label="Previous photo"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                disabled={isLoading}
                className="absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/20 p-3 text-white transition hover:border-white/50 hover:bg-white/10 disabled:opacity-40 sm:right-4 sm:block"
                aria-label="Next photo"
              >
                →
              </button>
            </>
          )}

          <div
            className="flex min-h-0 flex-1 flex-col pt-16"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-0 flex-1">
              <Image
                key={displayedPhoto.id}
                src={displayedPhoto.fullSrc}
                alt={displayedPhoto.alt}
                fill
                className={`object-contain transition-[filter,opacity,transform] duration-300 ease-out ${
                  isBlurred
                    ? "scale-[1.02] blur-xl opacity-80"
                    : "scale-100 blur-0 opacity-100"
                }`}
                sizes="100vw"
                priority
                onLoadingComplete={handleImageLoad}
              />
            </div>

            <motion.div
              key={displayedPhoto.id}
              className="shrink-0 px-6 pb-8 pt-4 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: isBlurred ? 0.5 : 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                {displayedPhoto.category}
              </p>
              <h2 className="mt-2 text-xl font-medium text-white sm:text-2xl">
                {displayedPhoto.title}
              </h2>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
