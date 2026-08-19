import { fetchSanity } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  aboutPageQuery,
  siteSettingsQuery,
  type SanityAboutPageDocument,
  type SanitySiteSettingsDocument,
} from "@/sanity/queries";
import type { AboutPageContent, SiteSettings } from "@/types";

const DEFAULT_ABOUT: AboutPageContent = {
  title: "The story behind the lens",
  paragraphs: [
    "Brian Wheeler Photography is a portfolio and print shop built with Next.js, TypeScript, Tailwind CSS, and Motion. Content is managed in Sanity Studio.",
    "Replace this copy with your bio, your process, and what inspires your work. The layout is intentionally minimal so your images stay front and center.",
  ],
  roadmapTitle: "Coming soon",
  roadmapItems: [
    "Instagram feed sync via the Graph API",
    "Stripe-powered checkout for print orders",
    "Individual photo detail pages with size selection",
  ],
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  heroEyebrow: "Fine Art Photography",
  heroHeadline: "Capturing light, mood, and the spaces in between.",
  heroDescription:
    "A portfolio built with Next.js and Motion. Manage photos, prints, and copy in Sanity Studio.",
  instagramUrl: "https://instagram.com",
};

function mapAboutPage(content: SanityAboutPageDocument): AboutPageContent {
  return {
    title: content.title,
    paragraphs: content.paragraphs,
    roadmapTitle: content.roadmapTitle ?? "Coming soon",
    roadmapItems: content.roadmapItems ?? [],
  };
}

function mapSiteSettings(content: SanitySiteSettingsDocument): SiteSettings {
  return {
    heroEyebrow: content.heroEyebrow ?? DEFAULT_SITE_SETTINGS.heroEyebrow,
    heroHeadline: content.heroHeadline ?? DEFAULT_SITE_SETTINGS.heroHeadline,
    heroDescription:
      content.heroDescription ?? DEFAULT_SITE_SETTINGS.heroDescription,
    instagramUrl: content.instagramUrl ?? DEFAULT_SITE_SETTINGS.instagramUrl,
  };
}

export async function getAboutPage(): Promise<AboutPageContent> {
  if (!isSanityConfigured) {
    return DEFAULT_ABOUT;
  }

  try {
    const content = await fetchSanity<SanityAboutPageDocument | null>(
      aboutPageQuery,
    );

    if (!content) {
      return DEFAULT_ABOUT;
    }

    return mapAboutPage(content);
  } catch {
    return DEFAULT_ABOUT;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const content = await fetchSanity<SanitySiteSettingsDocument | null>(
      siteSettingsQuery,
    );

    if (!content) {
      return DEFAULT_SITE_SETTINGS;
    }

    return mapSiteSettings(content);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
