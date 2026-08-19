import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "paragraphs",
      title: "Bio paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "roadmapTitle",
      title: "Roadmap section title",
      type: "string",
      initialValue: "Coming soon",
    }),
    defineField({
      name: "roadmapItems",
      title: "Roadmap items",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
