import type { PhotoCategory } from "@/types";
import {
  buildGalleryCategories,
  type GalleryCategory,
} from "@/lib/categories";
import { resolveCameraMetadata } from "@/lib/cameraMetadata";
import { fetchSanity } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";
import {
  allPhotosQuery,
  featuredPhotosQuery,
  photoByIdQuery,
  photosByCategoryQuery,
  type SanityPhotoDocument,
} from "@/sanity/queries";
import type { Photo } from "@/types";

const PLACEHOLDER_CAMERA_METADATA = {
  cameraModel: "Sony A7 IV",
  fStop: "f/8",
  exposureTime: "1/500s",
  iso: "400",
  focalLength: "200mm",
  lensMaker: "Sony",
  lensModel: "FE 200-600mm F5.6-6.3 G OSS",
} as const;

const PLACEHOLDER_PHOTOS: Photo[] = [
  {
    id: "1",
    title: "Golden Hour Ridge",
    alt: "Mountain ridge lit by golden sunset light",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    fullSrc:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2400&q=85",
    category: "landscape",
    featured: true,
    cameraMetadata: PLACEHOLDER_CAMERA_METADATA,
  },
  {
    id: "2",
    title: "Urban Reflection",
    alt: "City street reflected in rain puddles at night",
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
    fullSrc:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=2400&q=85",
    category: "city",
    featured: true,
  },
  {
    id: "3",
    title: "Quiet Portrait",
    alt: "Soft natural light portrait in black and white",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80",
    fullSrc:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=2400&q=85",
    category: "portrait",
    featured: true,
  },
  {
    id: "4",
    title: "Coastal Mist",
    alt: "Fog rolling over a rocky coastline",
    src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80",
    fullSrc:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=2400&q=85",
    category: "landscape",
  },
  {
    id: "5",
    title: "Neon Crosswalk",
    alt: "Pedestrians crossing a neon-lit intersection",
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&q=80",
    fullSrc:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=2400&q=85",
    category: "city",
  },
  {
    id: "6",
    title: "Studio Gaze",
    alt: "Close-up portrait with dramatic side lighting",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
    fullSrc:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=2400&q=85",
    category: "portrait",
  },
];

function mapPhoto(doc: SanityPhotoDocument): Photo {
  const cameraMetadata = resolveCameraMetadata(
    doc.assetMetadata,
    doc.cameraMetadata,
    {
      debugLabel: doc.title,
      log: process.env.NODE_ENV === "development",
    },
  );

  return {
    id: doc._id,
    title: doc.title,
    alt: doc.alt,
    src: urlFor(doc.image).width(1200).quality(85).url(),
    fullSrc: urlFor(doc.image).width(2400).quality(90).url(),
    category: doc.category,
    featured: doc.featured,
    instagramId: doc.instagramId,
    cameraMetadata,
  };
}

export async function getAllPhotos(): Promise<Photo[]> {
  if (!isSanityConfigured) {
    return PLACEHOLDER_PHOTOS;
  }

  try {
    const photos = await fetchSanity<SanityPhotoDocument[]>(allPhotosQuery);

    if (!photos.length) {
      return PLACEHOLDER_PHOTOS;
    }

    return photos.map(mapPhoto);
  } catch {
    return PLACEHOLDER_PHOTOS;
  }
}

export async function getFeaturedPhotos(): Promise<Photo[]> {
  if (!isSanityConfigured) {
    return PLACEHOLDER_PHOTOS.filter((photo) => photo.featured);
  }

  try {
    const photos =
      await fetchSanity<SanityPhotoDocument[]>(featuredPhotosQuery);

    if (!photos.length) {
      return PLACEHOLDER_PHOTOS.filter((photo) => photo.featured);
    }

    return photos.map(mapPhoto);
  } catch {
    return PLACEHOLDER_PHOTOS.filter((photo) => photo.featured);
  }
}

export async function getPhotoById(id: string): Promise<Photo | undefined> {
  if (!isSanityConfigured) {
    return PLACEHOLDER_PHOTOS.find((photo) => photo.id === id);
  }

  try {
    const photo = await fetchSanity<SanityPhotoDocument | null>(
      photoByIdQuery,
      { id },
    );

    return photo ? mapPhoto(photo) : undefined;
  } catch {
    return PLACEHOLDER_PHOTOS.find((photo) => photo.id === id);
  }
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  const photos = await getAllPhotos();
  return buildGalleryCategories(photos);
}

async function fetchPhotosByCategoryFromSanity(
  category: PhotoCategory,
): Promise<Photo[]> {
  try {
    const photos = await fetchSanity<SanityPhotoDocument[]>(
      photosByCategoryQuery,
      { category },
    );

    return photos.map(mapPhoto);
  } catch {
    return PLACEHOLDER_PHOTOS.filter((photo) => photo.category === category);
  }
}

export async function getCategoryPhotos(
  category: PhotoCategory,
): Promise<Photo[]> {
  if (!isSanityConfigured) {
    return PLACEHOLDER_PHOTOS.filter((photo) => photo.category === category);
  }

  const photos = await fetchPhotosByCategoryFromSanity(category);
  return photos.length
    ? photos
    : PLACEHOLDER_PHOTOS.filter((photo) => photo.category === category);
}
