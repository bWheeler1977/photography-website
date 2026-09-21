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

function photoListForFilter(
  S: StructureBuilder,
  title: string,
  filter: string,
  params?: Record<string, string | string[]>,
  initialCategory?: string,
) {
  let list = S.documentList()
    .title(title)
    .schemaType("photo")
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

  return list;
}

function categoryPhotoListItem(
  S: StructureBuilder,
  category: GalleryCategoryRow,
) {
  return S.listItem()
    .title(category.title)
    .child(
      photoListForFilter(
        S,
        category.title,
        '_type == "photo" && category == $category',
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
      .child(
        photoListForFilter(S, "All photos", '_type == "photo"'),
      ),
    S.listItem()
      .title("Recently updated")
      .child(
        S.documentList()
          .title("Recently updated")
          .schemaType("photo")
          .filter('_type == "photo"')
          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
      ),
    S.listItem()
      .title("Featured on homepage")
      .child(
        photoListForFilter(
          S,
          "Featured on homepage",
          '_type == "photo" && featured == true',
        ),
      ),
    S.divider(),
    ...categories.map((category) => categoryPhotoListItem(S, category)),
  ];

  if (orphanCategorySlugs.length > 0) {
    items.push(S.divider());
    items.push(
      S.listItem()
        .title("Other categories")
        .child(
          S.list()
            .title("Other categories")
            .items(
              orphanCategorySlugs.map((slug) =>
                S.listItem()
                  .title(formatCategorySlug(slug))
                  .child(
                    photoListForFilter(
                      S,
                      formatCategorySlug(slug),
                      '_type == "photo" && category == $category',
                      { category: slug },
                      slug,
                    ),
                  ),
              ),
            ),
        ),
    );
  }

  if (knownSlugs.length > 0) {
    items.push(
      S.listItem()
        .title("Outside gallery categories")
        .child(
          photoListForFilter(
            S,
            "Outside gallery categories",
            '_type == "photo" && !(category in $knownSlugs)',
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
