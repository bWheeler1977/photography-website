import { getSanityClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";
import {
  allPrintProductsQuery,
  type SanityPrintProductDocument,
} from "@/sanity/queries";
import { getFeaturedPhotos } from "@/lib/photos";
import type { PrintProduct } from "@/types";

const DEFAULT_SIZES = [
  { id: "8x10", label: '8" × 10"', dimensions: "8 × 10 in", priceCents: 4500 },
  {
    id: "16x20",
    label: '16" × 20"',
    dimensions: "16 × 20 in",
    priceCents: 9500,
  },
  {
    id: "24x36",
    label: '24" × 36"',
    dimensions: "24 × 36 in",
    priceCents: 18500,
  },
];

function mapPrintProduct(doc: SanityPrintProductDocument): PrintProduct {
  const lowestPrice = doc.sizes.reduce(
    (min, size) => Math.min(min, size.priceCents),
    doc.sizes[0]?.priceCents ?? 0,
  );

  return {
    id: doc._id,
    photoId: doc.photoId,
    title: doc.title,
    description: doc.description,
    priceCents: lowestPrice,
    sizes: doc.sizes,
    imageSrc: urlFor(doc.image).width(1200).quality(85).url(),
  };
}

async function getFallbackPrintProducts(): Promise<PrintProduct[]> {
  const photos = await getFeaturedPhotos();

  return photos.map((photo) => ({
    id: `print-${photo.id}`,
    photoId: photo.id,
    title: photo.title,
    description: `Archival pigment print of "${photo.title}" on premium matte paper.`,
    priceCents: DEFAULT_SIZES[0].priceCents,
    sizes: DEFAULT_SIZES,
    imageSrc: photo.src,
  }));
}

export async function getPrintProducts(): Promise<PrintProduct[]> {
  if (!isSanityConfigured) {
    return getFallbackPrintProducts();
  }

  try {
    const products = await getSanityClient().fetch<SanityPrintProductDocument[]>(
      allPrintProductsQuery,
    );

    if (!products.length) {
      return getFallbackPrintProducts();
    }

    return products.map(mapPrintProduct);
  } catch {
    return getFallbackPrintProducts();
  }
}

export async function getPrintProductById(
  id: string,
): Promise<PrintProduct | undefined> {
  const products = await getPrintProducts();
  return products.find((product) => product.id === id);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
