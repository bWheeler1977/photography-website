export type PhotoCameraMetadata = {
  cameraModel?: string;
  fStop?: string;
  exposureTime?: string;
  iso?: string;
  focalLength?: string;
  lensMaker?: string;
  lensModel?: string;
  copyright?: string;
};

export type Photo = {
  id: string;
  title: string;
  alt: string;
  src: string;
  fullSrc: string;
  category: PhotoCategory;
  featured?: boolean;
  instagramId?: string;
  cameraMetadata?: PhotoCameraMetadata;
};

export type PhotoCategory =
  | "landscape"
  | "birds"
  | "wildlife"
  | "city"
  | "portrait"
  | "nature"
  | "space"
  | "rural-rustic";

export type PrintProduct = {
  id: string;
  photoId: string;
  title: string;
  description: string;
  priceCents: number;
  sizes: PrintSize[];
  imageSrc: string;
};

export type PrintSize = {
  id: string;
  label: string;
  dimensions: string;
  priceCents: number;
};

export type InstagramMedia = {
  id: string;
  caption?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  mediaUrl: string;
  permalink: string;
  timestamp: string;
};

export type CartItem = {
  productId: string;
  sizeId: string;
  quantity: number;
};

export type AboutPageContent = {
  title: string;
  paragraphs: string[];
  roadmapTitle: string;
  roadmapItems: string[];
};

export type SiteSettings = {
  heroEyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  instagramUrl: string;
};
