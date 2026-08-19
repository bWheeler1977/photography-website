import { defineArrayMember, defineField, defineType } from "sanity";

export const printProduct = defineType({
  name: "printProduct",
  title: "Print Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "reference",
      to: [{ type: "photo" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sizes",
      title: "Available sizes",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "printSize",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "dimensions",
              title: "Dimensions",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "priceCents",
              title: "Price (cents)",
              type: "number",
              validation: (rule) => rule.required().min(0),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "dimensions" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "photo.image",
    },
  },
});
