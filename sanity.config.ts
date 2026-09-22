"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { featuredPhotoBadge } from "./src/sanity/badges/featuredPhotoBadge";
import { documentActions } from "./src/sanity/documentActions";
import { defaultDocumentNode } from "./src/sanity/defaultDocumentNode";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "default",
  title: "Brian Wheeler Photography",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure, defaultDocumentNode }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (previousTemplates) => [
      ...previousTemplates,
      {
        id: "photo-in-category",
        title: "Photo",
        schemaType: "photo",
        parameters: [
          {
            name: "category",
            title: "Category slug",
            type: "string",
          },
        ],
        value: ({ category }: { category?: string }) =>
          category ? { category } : {},
      },
    ],
  },
  document: {
    actions: documentActions,
    badges: (prev, context) =>
      context.schemaType === "photo" ? [featuredPhotoBadge, ...prev] : prev,
  },
});
