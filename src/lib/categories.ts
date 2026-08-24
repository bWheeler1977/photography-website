import type { Photo, PhotoCategory } from "@/types";

export const PHOTO_CATEGORIES: Record<PhotoCategory, string> = {
  landscape: "Landscape",
  birds: "Birds",
  wildlife: "Wildlife",
  city: "City",
  portrait: "Portrait",
  nature: "Nature",
  space: "Space",
  "rural-rustic": "Rural/Rustic",
};

export const PHOTO_CATEGORY_ORDER: PhotoCategory[] = [
  "landscape",
  "birds",
  "wildlife",
  "city",
  "portrait",
  "nature",
  "space",
  "rural-rustic",
];

export function isPhotoCategory(value: string): value is PhotoCategory {
  return value in PHOTO_CATEGORIES;
}

export function getCategoryLabel(category: PhotoCategory): string {
  return PHOTO_CATEGORIES[category];
}

export type GalleryCategory = {
  category: PhotoCategory;
  label: string;
  coverPhoto: Photo;
  photoCount: number;
};

export function buildGalleryCategories(photos: Photo[]): GalleryCategory[] {
  const photosByCategory = new Map<PhotoCategory, Photo[]>();

  for (const photo of photos) {
    const categoryPhotos = photosByCategory.get(photo.category) ?? [];
    categoryPhotos.push(photo);
    photosByCategory.set(photo.category, categoryPhotos);
  }

  return PHOTO_CATEGORY_ORDER.flatMap((category) => {
    const categoryPhotos = photosByCategory.get(category);

    if (!categoryPhotos?.length) {
      return [];
    }

    return [
      {
        category,
        label: getCategoryLabel(category),
        coverPhoto: categoryPhotos[0],
        photoCount: categoryPhotos.length,
      },
    ];
  });
}
