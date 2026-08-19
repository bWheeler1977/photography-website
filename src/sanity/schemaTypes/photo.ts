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
      options: { hotspot: true },
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
      name: "instagramId",
      title: "Instagram post ID",
      type: "string",
      description: "Optional link to an Instagram post for future sync.",
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
