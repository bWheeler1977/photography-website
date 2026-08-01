import type { Photo } from "@/types";

const PLACEHOLDER_PHOTOS: Photo[] = [
  {
    id: "1",
    title: "Golden Hour Ridge",
    alt: "Mountain ridge lit by golden sunset light",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    category: "landscape",
    featured: true,
  },
  {
    id: "2",
    title: "Urban Reflection",
    alt: "City street reflected in rain puddles at night",
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
    category: "street",
    featured: true,
  },
  {
    id: "3",
    title: "Quiet Portrait",
    alt: "Soft natural light portrait in black and white",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80",
    category: "portrait",
    featured: true,
  },
  {
    id: "4",
    title: "Coastal Mist",
    alt: "Fog rolling over a rocky coastline",
    src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80",
    category: "landscape",
  },
  {
    id: "5",
    title: "Neon Crosswalk",
    alt: "Pedestrians crossing a neon-lit intersection",
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80",
    category: "street",
  },
  {
    id: "6",
    title: "Studio Gaze",
    alt: "Close-up portrait with dramatic side lighting",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
    category: "portrait",
  },
];

export function getAllPhotos(): Photo[] {
  return PLACEHOLDER_PHOTOS;
}

export function getFeaturedPhotos(): Photo[] {
  return PLACEHOLDER_PHOTOS.filter((photo) => photo.featured);
}

export function getPhotoById(id: string): Photo | undefined {
  return PLACEHOLDER_PHOTOS.find((photo) => photo.id === id);
}
