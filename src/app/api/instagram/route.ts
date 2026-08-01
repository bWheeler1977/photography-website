import { NextResponse } from "next/server";
import {
  fetchInstagramMedia,
  isInstagramConfigured,
} from "@/lib/instagram/client";

export async function GET() {
  if (!isInstagramConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        media: [],
        message:
          "Instagram API is not configured. Add INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID to .env.local",
      },
      { status: 200 },
    );
  }

  try {
    const media = await fetchInstagramMedia();
    return NextResponse.json({ configured: true, media });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch Instagram media";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
