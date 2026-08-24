import type { Metadata } from "next";
import { CategoryGrid } from "@/components/gallery/CategoryGrid";
import {
  getCategoryLabel,
  PHOTO_CATEGORY_ORDER,
} from "@/lib/categories";
import { getGalleryCategories } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse photography collections by category.",
};

export default async function GalleryPage() {
  const categories = await getGalleryCategories();
  const categoryLabels = PHOTO_CATEGORY_ORDER.map((category) =>
    getCategoryLabel(category).toLowerCase(),
  ).join(", ");

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Portfolio</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Gallery
        </h1>
        <p className="mt-4 text-lg text-muted">
          Choose a collection to explore {categoryLabels} photography.
        </p>
      </header>
      <CategoryGrid categories={categories} />
    </div>
  );
}
