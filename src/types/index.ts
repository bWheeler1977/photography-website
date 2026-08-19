export type Photo = {
  id: string;
  title: string;
  alt: string;
  src: string;
  category: "landscape" | "portrait" | "street";
  featured?: boolean;
  instagramId?: string;
};

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
