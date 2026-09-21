"use client";

import type { GalleryCategory } from "@/lib/categories";
import { CategoryCard } from "@/components/gallery/CategoryCard";

type CategoryGridProps = {
  categories: GalleryCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category, index) => (
        <CategoryCard key={category.slug} category={category} index={index} />
      ))}
    </div>
  );
}
