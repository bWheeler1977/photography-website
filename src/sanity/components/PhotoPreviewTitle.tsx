"use client";

import { HomeIcon } from "@sanity/icons";
import { Box, Flex, Text, Tooltip } from "@sanity/ui";

type PhotoPreviewTitleProps = {
  title: string;
  featured?: boolean;
};

export function PhotoPreviewTitle({ title, featured }: PhotoPreviewTitleProps) {
  return (
    <Flex align="center" gap={2} justify="space-between" style={{ width: "100%" }}>
      <Box flex={1} style={{ minWidth: 0 }}>
        <Text size={1} weight="medium" textOverflow="ellipsis">
          {title}
        </Text>
      </Box>
      {featured ? (
        <Tooltip content="Featured on homepage" portal>
          <Box
            aria-label="Featured on homepage"
            flex="none"
            padding={1}
            style={{ color: "var(--card-muted-fg-color)" }}
          >
            <HomeIcon />
          </Box>
        </Tooltip>
      ) : null}
    </Flex>
  );
}
