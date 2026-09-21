import { getCliClient } from "sanity/cli";
import { DEFAULT_GALLERY_CATEGORIES } from "../src/lib/defaultGalleryCategories";

const client = getCliClient({ apiVersion: "2024-01-01" });

async function seedGalleryCategories() {
  let created = 0;
  let skipped = 0;

  for (const category of DEFAULT_GALLERY_CATEGORIES) {
    const existingId = await client.fetch<string | null>(
      `*[_type == "galleryCategory" && slug.current == $slug][0]._id`,
      { slug: category.slug },
    );

    if (existingId) {
      skipped += 1;
      continue;
    }

    await client.create({
      _type: "galleryCategory",
      title: category.title,
      slug: { _type: "slug", current: category.slug },
      passwordProtected: false,
      sortOrder: category.sortOrder,
    });

    created += 1;
  }

  console.log(
    `Gallery categories: ${created} created, ${skipped} already existed (${DEFAULT_GALLERY_CATEGORIES.length} total).`,
  );
}

seedGalleryCategories().catch((error) => {
  console.error(error);
  process.exit(1);
});
