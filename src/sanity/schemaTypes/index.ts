import type { SchemaTypeDefinition } from "sanity";
import { aboutPage } from "./aboutPage";
import { photo } from "./photo";
import { printProduct } from "./printProduct";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  photo,
  printProduct,
  aboutPage,
  siteSettings,
];
