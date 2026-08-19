"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import type { Photo } from "@/types";

type GalleryGridProps = {
  photos: Photo[];
};

export function GalleryGrid({ photos }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openPhoto = (index: number) => setSelectedIndex(index);
  const closePhoto = () => setSelectedIndex(null);

  return (
    <>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <motion.figure
            key={photo.id}
            className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
          >
            <button
              type="button"
              onClick={() => openPhoto(index)}
              className="group block w-full cursor-zoom-in text-left"
              aria-label={`View full size: ${photo.title}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <figcaption className="p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-muted">
                  {photo.category}
                </p>
                <p className="mt-1 font-medium">{photo.title}</p>
              </figcaption>
            </button>
          </motion.figure>
        ))}
      </div>

      <PhotoLightbox
        photos={photos}
        index={selectedIndex}
        onClose={closePhoto}
      />
    </>
  );
}
