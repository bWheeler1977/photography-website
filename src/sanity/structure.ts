import type { StructureResolver } from "sanity/structure";
import { formatCategorySlug } from "@/lib/galleryCategories";
import { apiVersion } from "@/sanity/env";
import {
  buildPhotoStructureItems,
  galleryCategoriesStructureQuery,
  photoCategorySlugsQuery,
} from "@/sanity/structure/photoStructure";

const singletonTypes = new Set(["aboutPage", "siteSettings"]);
const structuredDocumentTypes = new Set([
  ...singletonTypes,
  "galleryCategory",
  "photo",
]);

export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion });

  const [categories, photoCategorySlugs] = await Promise.all([
    client.fetch<Array<{ title: string; slug: string }>>(
      galleryCategoriesStructureQuery,
    ),
    client.fetch<string[]>(photoCategorySlugsQuery),
  ]);

  const knownSlugSet = new Set(
    categories.map((category) => category.slug).filter(Boolean),
  );
  const orphanCategorySlugs = [...new Set(photoCategorySlugs ?? [])]
    .filter((slug) => slug && !knownSlugSet.has(slug))
    .sort((a, b) => formatCategorySlug(a).localeCompare(formatCategorySlug(b)));

  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("About Page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.divider(),
      S.listItem()
        .title("Gallery Categories")
        .schemaType("galleryCategory")
        .child(
          S.documentTypeList("galleryCategory")
            .title("Gallery Categories")
            .child((documentId) =>
              S.document()
                .schemaType("galleryCategory")
                .documentId(documentId),
            ),
        ),
      S.divider(),
      ...buildPhotoStructureItems(S, categories, orphanCategorySlugs),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !structuredDocumentTypes.has(item.getId() ?? ""),
      ),
    ]);
};
