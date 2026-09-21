"use client";

import type { GalleryCategory } from "@/lib/categories";
import { CategoryCard } from "@/components/gallery/CategoryCard";

type CategoryGridProps = {
  categories: GalleryCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {categories.map((category, index) => (
        <CategoryCard key={category.slug} category={category} index={index} />
      ))}
    </div>
  );
}
