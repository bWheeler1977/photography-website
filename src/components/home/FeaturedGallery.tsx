"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import { useVisiblePhotoCount } from "@/components/home/useVisiblePhotoCount";
import type { Photo } from "@/types";

const AUTO_ADVANCE_MS = 5000;
const SLIDE_TRANSITION_DURATION = 0.6;
const CAROUSEL_GAP_PX = 24;

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

type FeaturedCarouselTrackProps = {
  photos: Photo[];
  visibleCount: number;
  slideIndex: number;
  skipTransition: boolean;
  onOpen: (index: number) => void;
};

function FeaturedCarouselTrack({
  photos,
  visibleCount,
  slideIndex,
  skipTransition,
  onOpen,
}: FeaturedCarouselTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateWidth = () => {
      const containerWidth = container.clientWidth;
      setItemWidth(
        (containerWidth - CAROUSEL_GAP_PX * (visibleCount - 1)) / visibleCount,
      );
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);

    return () => observer.disconnect();
  }, [visibleCount]);

  const translateX = slideIndex * (itemWidth + CAROUSEL_GAP_PX);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <motion.div
        className="flex"
        style={{ gap: CAROUSEL_GAP_PX }}
        animate={{ x: itemWidth > 0 ? -translateX : 0 }}
        transition={skipTransition ? { duration: 0 } : slideTransition}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="shrink-0"
            style={{ width: itemWidth > 0 ? itemWidth : "100%" }}
          >
            <FeaturedPhotoCard
              photo={photo}
              photoIndex={index}
              onOpen={onOpen}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function FeaturedGallery({ photos }: FeaturedGalleryProps) {
  const visibleCount = useVisiblePhotoCount();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [skipTransition, setSkipTransition] = useState(false);

  const needsCarousel = photos.length > visibleCount;
  const maxSlideIndex = Math.max(0, photos.length - visibleCount);
  const isLightboxOpen = selectedIndex !== null;

  const openPhoto = (index: number) => setSelectedIndex(index);
  const closePhoto = () => setSelectedIndex(null);

  const advanceSlide = (delta: 1 | -1) => {
    setSlideIndex((current) => {
      const next = current + delta;

      if (next > maxSlideIndex) {
        setSkipTransition(true);
        return 0;
      }

      if (next < 0) {
        setSkipTransition(true);
        return maxSlideIndex;
      }

      return next;
    });
  };

  const showPreviousSlide = () => advanceSlide(-1);
  const showNextSlide = () => advanceSlide(1);

  useEffect(() => {
    if (!skipTransition) return;

    const frame = requestAnimationFrame(() => setSkipTransition(false));
    return () => cancelAnimationFrame(frame);
  }, [skipTransition, slideIndex]);

  useEffect(() => {
    if (!needsCarousel || isLightboxOpen || photos.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setSlideIndex((current) => {
        if (current >= maxSlideIndex) {
          setSkipTransition(true);
          return 0;
        }

        return current + 1;
      });
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [isLightboxOpen, maxSlideIndex, needsCarousel, photos.length]);

  useEffect(() => {
    setSlideIndex(0);
    setSkipTransition(false);
  }, [visibleCount, photos.length]);

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
            <FeaturedCarouselTrack
              photos={photos}
              visibleCount={visibleCount}
              slideIndex={slideIndex}
              skipTransition={skipTransition}
              onOpen={openPhoto}
            />

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
