import type { StructureBuilder } from "sanity/structure";
import { formatCategorySlug } from "@/lib/galleryCategories";

export const photoListDefaultOrdering = [
  { field: "order", direction: "asc" as const },
  { field: "title", direction: "asc" as const },
];

type GalleryCategoryRow = {
  title: string;
  slug: string;
};

function slugifyListId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function photoDocumentChild(S: StructureBuilder) {
  return (documentId: string) =>
    S.document().schemaType("photo").documentId(documentId);
}

function photoListForFilter(
  S: StructureBuilder,
  listId: string,
  title: string,
  filter: string,
  params?: Record<string, string | string[]>,
  initialCategory?: string,
) {
  let list = S.documentTypeList("photo")
    .id(listId)
    .title(title)
    .filter(filter)
    .defaultOrdering(photoListDefaultOrdering);

  if (params) {
    list = list.params(params);
  }

  if (initialCategory) {
    list = list.initialValueTemplates([
      S.initialValueTemplateItem("photo-in-category", {
        category: initialCategory,
      }),
    ]);
  }

  return list.child(photoDocumentChild(S));
}

function categoryPhotoListItem(
  S: StructureBuilder,
  category: GalleryCategoryRow,
) {
  return S.listItem()
    .title(category.title)
    .id(`photos-${category.slug}`)
    .child(
      photoListForFilter(
        S,
        `photo-list-${category.slug}`,
        category.title,
        'category == $category',
        { category: category.slug },
        category.slug,
      ),
    );
}

export function buildPhotoStructureItems(
  S: StructureBuilder,
  categories: GalleryCategoryRow[],
  orphanCategorySlugs: string[],
) {
  const knownSlugs = categories.map((category) => category.slug);

  const items = [
    S.listItem()
      .title("All photos")
      .id("photos-all")
      .child(
        photoListForFilter(S, "photo-list-all", "All photos", '_type == "photo"'),
      ),
    S.listItem()
      .title("Recently updated")
      .id("photos-recent")
      .child(
        S.documentTypeList("photo")
          .id("photo-list-recent")
          .title("Recently updated")
          .filter('_type == "photo"')
          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
          .child(photoDocumentChild(S)),
      ),
    S.listItem()
      .title("Featured on homepage")
      .id("photos-featured")
      .child(
        photoListForFilter(
          S,
          "photo-list-featured",
          "Featured on homepage",
          "featured == true",
        ),
      ),
    S.divider(),
    ...categories.map((category) => categoryPhotoListItem(S, category)),
  ];

  if (orphanCategorySlugs.length > 0) {
    items.push(S.divider());
    for (const slug of orphanCategorySlugs) {
      items.push(
        S.listItem()
          .title(formatCategorySlug(slug))
          .id(`photos-${slug}`)
          .child(
            photoListForFilter(
              S,
              `photo-list-${slugifyListId(slug)}`,
              formatCategorySlug(slug),
              'category == $category',
              { category: slug },
              slug,
            ),
          ),
      );
    }
  }

  if (knownSlugs.length > 0) {
    items.push(
      S.listItem()
        .title("Outside gallery categories")
        .id("photos-outside-categories")
        .child(
          photoListForFilter(
            S,
            "photo-list-outside-categories",
            "Outside gallery categories",
            "!(category in $knownSlugs)",
            { knownSlugs },
          ),
        ),
    );
  }

  return items;
}

export const galleryCategoriesStructureQuery = `*[_type == "galleryCategory"] | order(sortOrder asc, title asc) {
  title,
  "slug": slug.current
}`;

export const photoCategorySlugsQuery = `array::unique(*[_type == "photo" && defined(category) && category != ""].category)`;
