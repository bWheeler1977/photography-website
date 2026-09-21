import { fetchSanity, fetchSanityFresh } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  DEFAULT_GALLERY_CATEGORIES,
  DEFAULT_GALLERY_CATEGORY_LABELS,
} from "@/lib/defaultGalleryCategories";
import {
  allGalleryCategoriesQuery,
  galleryCategoryUnlockQuery,
} from "@/sanity/queries";

export type GalleryCategoryDefinition = {
  slug: string;
  title: string;
  passwordProtected: boolean;
  allowDownload: boolean;
  sortOrder: number;
};

export function formatCategorySlug(slug: string): string {
  return DEFAULT_GALLERY_CATEGORY_LABELS[slug] ?? slug.replace(/-/g, " ");
}

function getDefaultGalleryCategoryDefinitions(): GalleryCategoryDefinition[] {
  return DEFAULT_GALLERY_CATEGORIES.map((category) => ({
    slug: category.slug,
    title: category.title,
    passwordProtected: false,
    allowDownload: false,
    sortOrder: category.sortOrder,
  }));
}

export async function getGalleryCategoryDefinitions(): Promise<
  GalleryCategoryDefinition[]
> {
  if (!isSanityConfigured) {
    return getDefaultGalleryCategoryDefinitions();
  }

  try {
    const categories = await fetchSanity<
      Array<{
        title: string;
        slug: string;
        passwordProtected?: boolean;
        allowDownload?: boolean;
        sortOrder?: number;
      }>
    >(allGalleryCategoriesQuery);

    if (!categories.length) {
      return getDefaultGalleryCategoryDefinitions();
    }

    return categories
      .filter((category) => Boolean(category.slug))
      .map((category) => ({
        slug: category.slug,
        title: category.title,
        passwordProtected: Boolean(category.passwordProtected),
        allowDownload: Boolean(category.allowDownload),
        sortOrder: category.sortOrder ?? 999,
      }));
  } catch {
    return getDefaultGalleryCategoryDefinitions();
  }
}

export async function getGalleryCategoryBySlug(
  slug: string,
): Promise<GalleryCategoryDefinition | undefined> {
  const categories = await getGalleryCategoryDefinitions();
  return categories.find((category) => category.slug === slug);
}

export async function getGalleryCategoryForUnlock(slug: string): Promise<
  | {
      passwordProtected: boolean;
      password?: string;
    }
  | undefined
> {
  if (!isSanityConfigured) {
    return { passwordProtected: false };
  }

  try {
    return await fetchSanityFresh<{
      passwordProtected?: boolean;
      password?: string;
    } | null>(galleryCategoryUnlockQuery, { slug }).then((result) =>
      result
        ? {
            passwordProtected: Boolean(result.passwordProtected),
            password: result.password,
          }
        : undefined,
    );
  } catch {
    return undefined;
  }
}

export function getCategoryLabelFromDefinitions(
  slug: string,
  definitions: GalleryCategoryDefinition[],
): string {
  return (
    definitions.find((category) => category.slug === slug)?.title ??
    formatCategorySlug(slug)
  );
}

export async function getCategoryLabel(slug: string): Promise<string> {
  const definitions = await getGalleryCategoryDefinitions();
  return getCategoryLabelFromDefinitions(slug, definitions);
}

export async function isValidCategorySlug(slug: string): Promise<boolean> {
  const definitions = await getGalleryCategoryDefinitions();
  return definitions.some((category) => category.slug === slug);
}
