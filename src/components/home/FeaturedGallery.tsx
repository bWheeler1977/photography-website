"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import type { Photo } from "@/types";

type FeaturedGalleryProps = {
  photos: Photo[];
};

export function FeaturedGallery({ photos }: FeaturedGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedPhoto =
    selectedIndex !== null ? photos[selectedIndex] ?? null : null;

  const openPhoto = (index: number) => setSelectedIndex(index);
  const closePhoto = () => setSelectedIndex(null);
  const showPrevious = () =>
    setSelectedIndex((current) =>
      current === null ? null : (current - 1 + photos.length) % photos.length,
    );
  const showNext = () =>
    setSelectedIndex((current) =>
      current === null ? null : (current + 1) % photos.length,
    );

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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <motion.article
              key={photo.id}
              className="group overflow-hidden rounded-2xl border border-border bg-surface"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                type="button"
                onClick={() => openPhoto(index)}
                className="block w-full cursor-zoom-in text-left"
                aria-label={`View full size: ${photo.title}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted">
                    {photo.category}
                  </p>
                  <h3 className="mt-2 text-lg font-medium">{photo.title}</h3>
                </div>
              </button>
            </motion.article>
          ))}
        </div>
      </div>

      <PhotoLightbox
        photo={selectedPhoto}
        onClose={closePhoto}
        onPrevious={photos.length > 1 ? showPrevious : undefined}
        onNext={photos.length > 1 ? showNext : undefined}
      />
    </section>
  );
}
