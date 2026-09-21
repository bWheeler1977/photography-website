import { createElement } from "react";
import { defineField, defineType } from "sanity";
import { CategorySlugInput } from "@/sanity/components/CategorySlugInput";
import { PhotoImageInput } from "@/sanity/components/PhotoImageInput";
import { PhotoPreviewMedia } from "@/sanity/components/PhotoPreviewMedia";
import { formatCategorySlug } from "@/lib/galleryCategories";

export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  orderings: [
    {
      title: "Gallery order",
      name: "galleryOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Title, A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Title, Z–A",
      name: "titleDesc",
      by: [{ field: "title", direction: "desc" }],
    },
    {
      title: "Category, then title",
      name: "categoryAsc",
      by: [
        { field: "category", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Recently updated",
      name: "updatedDesc",
      by: [{ field: "_updatedAt", direction: "desc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description:
        "Upload the original in-camera JPEG when possible so camera and copyright metadata can be read automatically.",
      options: {
        hotspot: true,
        metadata: ["exif", "image"],
      },
      components: {
        input: PhotoImageInput,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Choose a gallery category. Create new categories under Gallery Categories in the Studio sidebar.",
      components: {
        input: CategorySlugInput,
      },
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.trim()) {
            return {
              message:
                "Photos without a category stay out of the public gallery until you assign one.",
              level: "warning",
            };
          }

          return true;
        }),
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "photoByRonaldWheeler",
      title: "Photo by Ronald Wheeler",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "instagramId",
      title: "Instagram post ID",
      type: "string",
      description: "Optional link to an Instagram post for future sync.",
    }),
    defineField({
      name: "cameraMetadata",
      title: "Camera metadata",
      type: "object",
      description:
        "Upload the original in-camera JPEG to preserve camera and copyright metadata. Auto-detected values fill these fields when EXIF is available.",
      fields: [
        defineField({
          name: "cameraModel",
          title: "Camera model",
          type: "string",
        }),
        defineField({
          name: "fStop",
          title: "F-stop",
          type: "string",
          description: 'Example: f/2.8',
        }),
        defineField({
          name: "exposureTime",
          title: "Exposure time",
          type: "string",
          description: "Example: 1/500s",
        }),
        defineField({
          name: "iso",
          title: "ISO speed",
          type: "string",
          description: "Example: 400",
        }),
        defineField({
          name: "focalLength",
          title: "Focal length",
          type: "string",
          description: "Example: 200mm",
        }),
        defineField({
          name: "lensMaker",
          title: "Lens maker",
          type: "string",
        }),
        defineField({
          name: "lensModel",
          title: "Lens model",
          type: "string",
        }),
        defineField({
          name: "copyright",
          title: "Copyright",
          type: "string",
          description: "Example: © 2026 Brian Wheeler Photography",
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first in the gallery.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
      featured: "featured",
      order: "order",
    },
    prepare({ title, subtitle, media, featured, order }) {
      const categoryLabel = subtitle
        ? formatCategorySlug(String(subtitle))
        : undefined;
      const orderLabel =
        typeof order === "number" ? ` · Gallery #${order}` : undefined;

      return {
        title,
        subtitle:
          categoryLabel && orderLabel
            ? `${categoryLabel}${orderLabel}`
            : categoryLabel ?? orderLabel,
        media:
          featured && media
            ? createElement(PhotoPreviewMedia, { image: media, featured: true })
            : media,
      };
    },
  },
});
