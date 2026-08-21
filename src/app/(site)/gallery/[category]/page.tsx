import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getCategoryLabel, isPhotoCategory } from "@/lib/categories";
import { getCategoryPhotos, getGalleryCategories } from "@/lib/photos";

type CategoryGalleryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await getGalleryCategories();

  return categories.map(({ category }) => ({
    category,
  }));
}

export async function generateMetadata({
  params,
}: CategoryGalleryPageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isPhotoCategory(category)) {
    return { title: "Gallery" };
  }

  return {
    title: getCategoryLabel(category),
    description: `Browse ${getCategoryLabel(category).toLowerCase()} photography.`,
  };
}

export default async function CategoryGalleryPage({
  params,
}: CategoryGalleryPageProps) {
  const { category } = await params;

  if (!isPhotoCategory(category)) {
    notFound();
  }

  const photos = await getCategoryPhotos(category);

  if (!photos.length) {
    notFound();
  }

  const label = getCategoryLabel(category);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12 max-w-2xl">
        <Link
          href="/gallery"
          className="text-sm text-muted transition hover:text-foreground"
        >
          &larr; All collections
        </Link>
        <p className="mt-6 text-sm uppercase tracking-[0.2em] text-muted">
          Collection
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          {label}
        </h1>
        <p className="mt-4 text-lg text-muted">
          {photos.length} {photos.length === 1 ? "photograph" : "photographs"}
          . Click any image to view it full size.
        </p>
      </header>
      <GalleryGrid photos={photos} />
    </div>
  );
}
