import type { GalleryCategoryDefinition } from "@/lib/galleryCategories";
import type { Photo } from "@/types";

export type GalleryCategory = {
  slug: string;
  label: string;
  passwordProtected: boolean;
  coverPhoto: Photo;
  photoCount: number;
};

export function buildGalleryCategories(
  categoryDefinitions: GalleryCategoryDefinition[],
  photos: Photo[],
): GalleryCategory[] {
  const photosBySlug = new Map<string, Photo[]>();

  for (const photo of photos) {
    const categoryPhotos = photosBySlug.get(photo.category) ?? [];
    categoryPhotos.push(photo);
    photosBySlug.set(photo.category, categoryPhotos);
  }

  return categoryDefinitions.flatMap((definition) => {
    const categoryPhotos = photosBySlug.get(definition.slug);

    if (!categoryPhotos?.length) {
      return [];
    }

    return [
      {
        slug: definition.slug,
        label: definition.title,
        passwordProtected: definition.passwordProtected,
        coverPhoto: categoryPhotos[0],
        photoCount: categoryPhotos.length,
      },
    ];
  });
}
