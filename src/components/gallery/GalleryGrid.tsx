"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Photo } from "@/types";

type GalleryGridProps = {
  photos: Photo[];
};

export function GalleryGrid({ photos }: GalleryGridProps) {
  return (
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
          <div className="relative aspect-[3/4]">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <figcaption className="p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-muted">
              {photo.category}
            </p>
            <p className="mt-1 font-medium">{photo.title}</p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
