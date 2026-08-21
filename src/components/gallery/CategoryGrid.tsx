"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { GalleryCategory } from "@/lib/categories";

type CategoryGridProps = {
  categories: GalleryCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {categories.map((category, index) => (
        <motion.figure
          key={category.category}
          className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
        >
          <Link
            href={`/gallery/${category.category}`}
            className="group block text-left"
            aria-label={`View ${category.label} gallery`}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={category.coverPhoto.src}
                alt={category.coverPhoto.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <figcaption className="p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-muted">
                {category.photoCount}{" "}
                {category.photoCount === 1 ? "photo" : "photos"}
              </p>
              <p className="mt-1 text-lg font-medium">{category.label}</p>
            </figcaption>
          </Link>
        </motion.figure>
      ))}
    </div>
  );
}
