import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["aboutPage", "siteSettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
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
          S.documentTypeList("galleryCategory").title("Gallery Categories"),
        ),
      ...S.documentTypeListItems().filter(
        (item) =>
          !singletonTypes.has(item.getId() ?? "") &&
          item.getId() !== "galleryCategory",
      ),
    ]);
