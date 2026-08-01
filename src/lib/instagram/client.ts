import type { InstagramMedia } from "@/types";

const INSTAGRAM_GRAPH_BASE = "https://graph.instagram.com";

type InstagramConfig = {
  accessToken: string;
  userId: string;
};

function getInstagramConfig(): InstagramConfig | null {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    return null;
  }

  return { accessToken, userId };
}

/**
 * Fetch recent Instagram media for the connected account.
 * Requires INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID env vars.
 *
 * @see https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
 */
export async function fetchInstagramMedia(
  limit = 12,
): Promise<InstagramMedia[]> {
  const config = getInstagramConfig();

  if (!config) {
    return [];
  }

  const fields = "id,caption,media_type,media_url,permalink,timestamp";
  const url = new URL(`${INSTAGRAM_GRAPH_BASE}/${config.userId}/media`);
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", config.accessToken);

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Instagram API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    data?: Array<{
      id: string;
      caption?: string;
      media_type: string;
      media_url: string;
      permalink: string;
      timestamp: string;
    }>;
  };

  return (data.data ?? []).map((item) => ({
    id: item.id,
    caption: item.caption,
    mediaType: item.media_type as InstagramMedia["mediaType"],
    mediaUrl: item.media_url,
    permalink: item.permalink,
    timestamp: item.timestamp,
  }));
}

export function isInstagramConfigured(): boolean {
  return getInstagramConfig() !== null;
}
