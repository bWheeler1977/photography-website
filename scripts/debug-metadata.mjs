import { createClient } from "next-sanity";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf8");
const get = (key) => env.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1]?.trim();

const client = createClient({
  projectId: get("NEXT_PUBLIC_SANITY_PROJECT_ID"),
  dataset: get("NEXT_PUBLIC_SANITY_DATASET") || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const query = `*[_type == "photo"] | order(_updatedAt desc)[0...5] {
  title,
  cameraMetadata,
  "assetId": image.asset->_id,
  "extension": image.asset->extension,
  "mimeType": image.asset->mimeType,
  "assetMetadata": image.asset->metadata {
    exif,
    image,
    dimensions
  }
}`;

const photos = await client.fetch(query);
console.log(JSON.stringify(photos, null, 2));
