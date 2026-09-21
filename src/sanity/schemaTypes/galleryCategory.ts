import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const galleryCategory = defineType({
  name: "galleryCategory",
  title: "Gallery Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used in the gallery URL (for example /gallery/birds).",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "passwordProtected",
      title: "Password protected",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "password",
      title: "Gallery password",
      type: "string",
      description: "Required when password protection is enabled.",
      hidden: ({ document }) => !document?.passwordProtected,
      validation: (rule) =>
        rule.custom((value, context) => {
          const passwordProtected = (context.document as { passwordProtected?: boolean })
            ?.passwordProtected;

          if (passwordProtected && !value?.trim()) {
            return "Enter a password for protected galleries.";
          }

          return true;
        }),
    }),
    defineField({
      name: "allowDownload",
      title: "Allow photo downloads",
      type: "boolean",
      description:
        "When enabled, visitors can download full-size images from this gallery.",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first on the gallery page.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
      passwordProtected: "passwordProtected",
    },
    prepare({ title, subtitle, passwordProtected }) {
      return {
        title,
        subtitle: passwordProtected
          ? `${subtitle ?? ""} · Password protected`
          : subtitle,
      };
    },
  },
});
