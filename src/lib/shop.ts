import type { PrintProduct } from "@/types";
import { getFeaturedPhotos } from "@/lib/photos";

const DEFAULT_SIZES = [
  { id: "8x10", label: '8" × 10"', dimensions: "8 × 10 in", priceCents: 4500 },
  { id: "16x20", label: '16" × 20"', dimensions: "16 × 20 in", priceCents: 9500 },
  { id: "24x36", label: '24" × 36"', dimensions: "24 × 36 in", priceCents: 18500 },
];

export function getPrintProducts(): PrintProduct[] {
  return getFeaturedPhotos().map((photo) => ({
    id: `print-${photo.id}`,
    photoId: photo.id,
    title: photo.title,
    description: `Archival pigment print of "${photo.title}" on premium matte paper.`,
    priceCents: DEFAULT_SIZES[0].priceCents,
    sizes: DEFAULT_SIZES,
    imageSrc: photo.src,
  }));
}

export function getPrintProductById(id: string): PrintProduct | undefined {
  return getPrintProducts().find((product) => product.id === id);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
