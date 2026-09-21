"use client";

import { Card, Select, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
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
          setOptions(categories.filter((category) => Boolean(category.value)));
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
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

  if (!options.length) {
    return (
      <Card padding={3} radius={2} tone="caution" border>
        <Stack space={2}>
          <Text size={1} weight="medium">
            No gallery categories yet
          </Text>
          <Text size={1} muted>
            Create one under Gallery Categories in the Studio sidebar, then
            assign it here.
          </Text>
        </Stack>
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
