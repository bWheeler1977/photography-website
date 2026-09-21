import type { SchemaTypeDefinition } from "sanity";
import { aboutPage } from "./aboutPage";
import { galleryCategory } from "./galleryCategory";
import { photo } from "./photo";
import { printProduct } from "./printProduct";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  galleryCategory,
  photo,
  printProduct,
  aboutPage,
  siteSettings,
];
