import { defineField, defineType } from "sanity";

export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
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
      options: {
        hotspot: true,
        metadata: ["exif"],
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
      options: {
        list: [
          { title: "Landscape", value: "landscape" },
          { title: "Birds", value: "birds" },
          { title: "Wildlife", value: "wildlife" },
          { title: "City", value: "city" },
          { title: "Portrait", value: "portrait" },
          { title: "Nature", value: "nature" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required().error("Category is required"),
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
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
        "Optional manual camera details. EXIF from the uploaded image is used when a field is left blank.",
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
    },
  },
});
