"use client";

import { Card, Select, Text } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_GALLERY_CATEGORY_OPTIONS } from "@/lib/defaultGalleryCategories";
import type { StringInputProps } from "sanity";
import { PatchEvent, set, unset, useClient } from "sanity";

type CategoryOption = {
  title: string;
  value: string;
};

export function CategorySlugInput(props: StringInputProps) {
  const { onChange, value } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    client
      .fetch<CategoryOption[]>(
        `*[_type == "galleryCategory"] | order(coalesce(sortOrder, 999) asc, title asc) {
          title,
          "value": slug.current
        }`,
      )
      .then((categories) => {
        if (isMounted) {
          const fromSanity = categories.filter((category) =>
            Boolean(category.value),
          );
          setOptions(
            fromSanity.length > 0 ? fromSanity : DEFAULT_GALLERY_CATEGORY_OPTIONS,
          );
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOptions(DEFAULT_GALLERY_CATEGORY_OPTIONS);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [client]);

  const handleChange = useCallback(
    (nextValue: string) => {
      onChange(PatchEvent.from(nextValue ? set(nextValue) : unset()));
    },
    [onChange],
  );

  if (isLoading) {
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>
          Loading gallery categories…
        </Text>
      </Card>
    );
  }

  return (
    <Select
      value={value ?? ""}
      onChange={(event) => handleChange(event.currentTarget.value)}
    >
      <option value="">Select a category</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.title}
        </option>
      ))}
    </Select>
  );
}
