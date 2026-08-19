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
