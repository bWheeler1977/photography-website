import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { getSanityClient } from "./client";

export function urlFor(source: SanityImageSource) {
  return createImageUrlBuilder(getSanityClient()).image(source);
}
