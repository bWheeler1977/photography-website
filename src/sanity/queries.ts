import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { groq } from "next-sanity";

const visibleGalleryCategorySlugsFilter = groq`
  *[_type == "galleryCategory" && coalesce(showOnSite, true) == true].slug.current
`;

export const allPhotosQuery = groq`
  *[
    _type == "photo"
    && category in ${visibleGalleryCategorySlugsFilter}
  ] | order(coalesce(order, 999) asc, _createdAt desc) {
    _id,
    title,
    "alt": image.alt,
    image,
    category,
    featured,
    photoByRonaldWheeler,
    instagramId,
    cameraMetadata,
    "assetMetadata": image.asset->metadata {
      exif,
      image
    }
  }
`;

export const featuredPhotosQuery = groq`
  *[
    _type == "photo"
    && featured == true
    && category in ${visibleGalleryCategorySlugsFilter}
  ] | order(coalesce(order, 999) asc, _createdAt desc) {
    _id,
    title,
    "alt": image.alt,
    image,
    category,
    featured,
    photoByRonaldWheeler,
    instagramId,
    cameraMetadata,
    "assetMetadata": image.asset->metadata {
      exif,
      image
    }
  }
`;

export const photoByIdQuery = groq`
  *[_type == "photo" && _id == $id][0] {
    _id,
    title,
    "alt": image.alt,
    image,
    category,
    featured,
    photoByRonaldWheeler,
    instagramId,
    cameraMetadata,
    "assetMetadata": image.asset->metadata {
      exif,
      image
    }
  }
`;

const galleryCategoryFields = groq`
  title,
  "slug": slug.current,
  showOnSite,
  passwordProtected,
  allowDownload,
  sortOrder
`;

export const allGalleryCategoriesQuery = groq`
  *[_type == "galleryCategory"] | order(coalesce(sortOrder, 999) asc, title asc) {
    ${galleryCategoryFields}
  }
`;

export const publicGalleryCategoriesQuery = groq`
  *[
    _type == "galleryCategory"
    && coalesce(showOnSite, true) == true
  ] | order(coalesce(sortOrder, 999) asc, title asc) {
    ${galleryCategoryFields}
  }
`;

export const galleryCategoryUnlockQuery = groq`
  *[_type == "galleryCategory" && slug.current == $slug][0] {
    showOnSite,
    passwordProtected,
    password
  }
`;

export const photosByCategoryQuery = groq`
  *[
    _type == "photo"
    && category == $category
    && category in ${visibleGalleryCategorySlugsFilter}
  ] | order(coalesce(order, 999) asc, _createdAt desc) {
    _id,
    title,
    "alt": image.alt,
    image,
    category,
    featured,
    photoByRonaldWheeler,
    instagramId,
    cameraMetadata,
    "assetMetadata": image.asset->metadata {
      exif,
      image
    }
  }
`;

export const allPrintProductsQuery = groq`
  *[_type == "printProduct" && published == true] | order(_createdAt desc) {
    _id,
    title,
    description,
    sizes[] {
      "id": _key,
      label,
      dimensions,
      priceCents
    },
    "photoId": photo->_id,
    "image": photo->image
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage" && _id == "aboutPage"][0] {
    title,
    paragraphs,
    roadmapTitle,
    roadmapItems
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    heroEyebrow,
    heroHeadline,
    heroDescription,
    instagramUrl
  }
`;

export type SanityPhotoDocument = {
  _id: string;
  title: string;
  alt: string;
  image: SanityImageSource;
  category: string;
  featured?: boolean;
  photoByRonaldWheeler?: boolean;
  instagramId?: string;
  cameraMetadata?: {
    cameraModel?: string;
    fStop?: string;
    exposureTime?: string;
    iso?: string;
    focalLength?: string;
    lensMaker?: string;
    lensModel?: string;
    copyright?: string;
  };
  assetMetadata?: {
    exif?: Record<string, unknown>;
    image?: Record<string, unknown>;
  };
};

export type SanityPrintProductDocument = {
  _id: string;
  title: string;
  description: string;
  photoId: string;
  image: SanityImageSource;
  sizes: Array<{
    id: string;
    label: string;
    dimensions: string;
    priceCents: number;
  }>;
};

export type SanityAboutPageDocument = {
  title: string;
  paragraphs: string[];
  roadmapTitle?: string;
  roadmapItems?: string[];
};

export type SanitySiteSettingsDocument = {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroDescription?: string;
  instagramUrl?: string;
};
