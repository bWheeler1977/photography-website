"use client";

import { HomeIcon } from "@sanity/icons";
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { Box, Tooltip } from "@sanity/ui";
import { useClient } from "sanity";

const PREVIEW_SIZE = 33;

type PhotoPreviewMediaProps = {
  image: SanityImageSource;
  featured?: boolean;
};

export function PhotoPreviewMedia({ image, featured }: PhotoPreviewMediaProps) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const imageUrl = createImageUrlBuilder(client)
    .image(image)
    .width(PREVIEW_SIZE * 2)
    .height(PREVIEW_SIZE * 2)
    .fit("crop")
    .url();

  return (
    <Box style={{ position: "relative", overflow: "visible", flexShrink: 0 }}>
      <Box
        style={{
          width: PREVIEW_SIZE,
          height: PREVIEW_SIZE,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <img
          src={imageUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>
      {featured ? (
        <Tooltip content="Featured on homepage" portal>
          <Box
            aria-label="Featured on homepage"
            style={{
              position: "absolute",
              right: -24,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--card-muted-fg-color)",
              display: "flex",
              padding: 4,
            }}
          >
            <HomeIcon />
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
}
