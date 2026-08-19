import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getAllPhotos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse the full photography collection.",
};

export default async function GalleryPage() {
  const photos = await getAllPhotos();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Portfolio</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Gallery
        </h1>
        <p className="mt-4 text-lg text-muted">
          A curated collection of landscape, portrait, and street photography.
          Manage photos in Sanity Studio at <code className="text-foreground">/studio</code>.
        </p>
      </header>
      <GalleryGrid photos={photos} />
    </div>
  );
}
