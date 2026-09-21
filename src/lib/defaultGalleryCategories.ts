export type DefaultGalleryCategory = {
  title: string;
  slug: string;
  sortOrder: number;
};

/** Original portfolio categories — seeded into Sanity as galleryCategory documents. */
export const DEFAULT_GALLERY_CATEGORIES: DefaultGalleryCategory[] = [
  { title: "Landscape", slug: "landscape", sortOrder: 0 },
  { title: "Birds", slug: "birds", sortOrder: 1 },
  { title: "Wildlife", slug: "wildlife", sortOrder: 2 },
  { title: "City", slug: "city", sortOrder: 3 },
  { title: "Portrait", slug: "portrait", sortOrder: 4 },
  { title: "Nature", slug: "nature", sortOrder: 5 },
  { title: "Space", slug: "space", sortOrder: 6 },
  { title: "Rural/Rustic", slug: "rural-rustic", sortOrder: 7 },
];

export const DEFAULT_GALLERY_CATEGORY_OPTIONS = DEFAULT_GALLERY_CATEGORIES.map(
  (category) => ({
    title: category.title,
    value: category.slug,
  }),
);

export const DEFAULT_GALLERY_CATEGORY_LABELS = Object.fromEntries(
  DEFAULT_GALLERY_CATEGORIES.map((category) => [category.slug, category.title]),
) as Record<string, string>;
