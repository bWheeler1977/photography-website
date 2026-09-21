import {
  createClient,
  type QueryParams,
  type SanityClient,
} from "next-sanity";
import {
  apiVersion,
  dataset,
  isSanityConfigured,
  projectId,
  sanityRevalidateSeconds,
} from "./env";

let sanityClient: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error("Sanity is not configured");
  }

  if (!sanityClient) {
    sanityClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    });
  }

  return sanityClient;
}

export async function fetchSanity<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  return getSanityClient().fetch<T>(query, params, {
    next: { revalidate: sanityRevalidateSeconds },
  });
}

export function getSanityServerClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error("Sanity is not configured");
  }

  const token = process.env.SANITY_API_READ_TOKEN;

  if (!token) {
    throw new Error("SANITY_API_READ_TOKEN is not configured");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}

export async function fetchSanityWithToken<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  return getSanityServerClient().fetch<T>(query, params, {
    cache: "no-store",
  });
}

/** Server-side fetch bypassing CDN cache (no token required on public datasets). */
export async function fetchSanityFresh<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  });

  return client.fetch<T>(query, params, { cache: "no-store" });
}

/** Published content only — bypasses Sanity CDN and Next.js data cache (gallery visibility, etc.). */
export async function fetchSanityPublished<T>(
  query: string,
  params: QueryParams = {},
): Promise<T> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  });

  return client.fetch<T>(query, params, {
    cache: "no-store",
    perspective: "published",
  });
}
