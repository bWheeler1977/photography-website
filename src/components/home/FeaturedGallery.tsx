"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import { useVisiblePhotoCount } from "@/components/home/useVisiblePhotoCount";
import type { Photo } from "@/types";

const AUTO_ADVANCE_MS = 5000;
const SLIDE_TRANSITION_DURATION = 0.6;

const slideTransition = {
  duration: SLIDE_TRANSITION_DURATION,
  ease: [0.4, 0, 0.2, 1] as const,
};

type FeaturedGalleryProps = {
  photos: Photo[];
};

type FeaturedPhotoCardProps = {
  photo: Photo;
  photoIndex: number;
  onOpen: (index: number) => void;
};

function FeaturedPhotoCard({ photo, photoIndex, onOpen }: FeaturedPhotoCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => onOpen(photoIndex)}
        className="block w-full cursor-zoom-in text-left"
        aria-label={`View full size: ${photo.title}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-muted">
            {photo.category}
          </p>
          <h3 className="mt-2 text-lg font-medium">{photo.title}</h3>
        </div>
      </button>
    </article>
  );
}

function gridColumnsClass(visibleCount: number): string {
  if (visibleCount === 1) return "grid-cols-1";
  if (visibleCount === 2) return "grid-cols-2";
  return "grid-cols-3";
}

export function FeaturedGallery({ photos }: FeaturedGalleryProps) {
  const visibleCount = useVisiblePhotoCount();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const needsCarousel = photos.length > visibleCount;
  const isLightboxOpen = selectedIndex !== null;

  const openPhoto = (index: number) => setSelectedIndex(index);
  const closePhoto = () => setSelectedIndex(null);

  const showPreviousSlide = () => {
    setDirection(-1);
    setSlideIndex((current) => (current - 1 + photos.length) % photos.length);
  };

  const showNextSlide = () => {
    setDirection(1);
    setSlideIndex((current) => (current + 1) % photos.length);
  };

  useEffect(() => {
    if (!needsCarousel || isLightboxOpen || photos.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection(1);
      setSlideIndex((current) => (current + 1) % photos.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [needsCarousel, isLightboxOpen, photos.length]);

  useEffect(() => {
    setSlideIndex(0);
  }, [visibleCount, photos.length]);

  const visiblePhotos = Array.from({ length: visibleCount }, (_, offset) => {
    const photoIndex = (slideIndex + offset) % photos.length;
    return {
      photo: photos[photoIndex],
      photoIndex,
    };
  });

  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border/60 bg-surface/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Featured</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Selected Works
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-sm text-muted transition hover:text-foreground"
          >
            View all &rarr;
          </Link>
        </div>

        {needsCarousel ? (
          <div className="relative">
            <div className="overflow-hidden">
              <LayoutGroup id="featured-carousel">
                <div
                  className={`grid gap-6 ${gridColumnsClass(visibleCount)}`}
                >
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={direction}
                  >
                    {visiblePhotos.map(({ photo, photoIndex }) => (
                      <motion.div
                        key={photo.id}
                        layout
                        custom={direction}
                        variants={{
                          enter: (slideDirection: number) => ({
                            x: slideDirection > 0 ? "100%" : "-100%",
                          }),
                          center: { x: 0 },
                          exit: (slideDirection: number) => ({
                            x: slideDirection > 0 ? "-100%" : "100%",
                          }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          layout: slideTransition,
                          x: slideTransition,
                        }}
                      >
                        <FeaturedPhotoCard
                          photo={photo}
                          photoIndex={photoIndex}
                          onOpen={openPhoto}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </LayoutGroup>
            </div>

            <button
              type="button"
              onClick={showPreviousSlide}
              className="absolute left-0 top-[calc(50%-2.5rem)] z-10 -translate-y-1/2 rounded-full border border-border bg-background/90 p-2.5 text-foreground transition hover:border-accent hover:text-accent sm:p-3 md:-left-5"
              aria-label="Previous featured photos"
            >
              ←
            </button>
            <button
              type="button"
              onClick={showNextSlide}
              className="absolute right-0 top-[calc(50%-2.5rem)] z-10 -translate-y-1/2 rounded-full border border-border bg-background/90 p-2.5 text-foreground transition hover:border-accent hover:text-accent sm:p-3 md:-right-5"
              aria-label="Next featured photos"
            >
              →
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${gridColumnsClass(visibleCount)}`}>
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeaturedPhotoCard
                  photo={photo}
                  photoIndex={index}
                  onOpen={openPhoto}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <PhotoLightbox
        photos={photos}
        index={selectedIndex}
        onClose={closePhoto}
      />
    </section>
  );
}
