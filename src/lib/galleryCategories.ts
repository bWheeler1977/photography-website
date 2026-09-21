import { fetchSanity, fetchSanityWithToken } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  allGalleryCategoriesQuery,
  galleryCategoryUnlockQuery,
} from "@/sanity/queries";

export type GalleryCategoryDefinition = {
  slug: string;
  title: string;
  passwordProtected: boolean;
  sortOrder: number;
};

const LEGACY_CATEGORY_LABELS: Record<string, string> = {
  landscape: "Landscape",
  birds: "Birds",
  wildlife: "Wildlife",
  city: "City",
  portrait: "Portrait",
  nature: "Nature",
  space: "Space",
  "rural-rustic": "Rural/Rustic",
};

export function formatCategorySlug(slug: string): string {
  return LEGACY_CATEGORY_LABELS[slug] ?? slug.replace(/-/g, " ");
}

export async function getGalleryCategoryDefinitions(): Promise<
  GalleryCategoryDefinition[]
> {
  if (!isSanityConfigured) {
    return Object.entries(LEGACY_CATEGORY_LABELS).map(([slug, title], index) => ({
      slug,
      title,
      passwordProtected: false,
      sortOrder: index,
    }));
  }

  try {
    const categories = await fetchSanity<
      Array<{
        title: string;
        slug: string;
        passwordProtected?: boolean;
        sortOrder?: number;
      }>
    >(allGalleryCategoriesQuery);

    if (!categories.length) {
      return Object.entries(LEGACY_CATEGORY_LABELS).map(([slug, title], index) => ({
        slug,
        title,
        passwordProtected: false,
        sortOrder: index,
      }));
    }

    return categories
      .filter((category) => Boolean(category.slug))
      .map((category) => ({
        slug: category.slug,
        title: category.title,
        passwordProtected: Boolean(category.passwordProtected),
        sortOrder: category.sortOrder ?? 999,
      }));
  } catch {
    return Object.entries(LEGACY_CATEGORY_LABELS).map(([slug, title], index) => ({
      slug,
      title,
      passwordProtected: false,
      sortOrder: index,
    }));
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
    return await fetchSanityWithToken<{
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
