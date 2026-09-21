"use client";

import { TrashIcon } from "@sanity/icons";
import { Box, Button, Card, Flex, Select, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
import { useClient } from "sanity";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";

import { apiVersion } from "@/sanity/env";

type CategoryOption = {
  slug: string;
  title: string;
};

const CLEAR_CATEGORY_VALUE = "__clear__";

function DeleteGalleryCategoryDialog({
  id,
  draft,
  published,
  onComplete,
  onClose,
}: DocumentActionProps & { onClose: () => void }) {
  const client = useClient({ apiVersion });
  const document = (draft ?? published) as
    | {
        title?: string;
        slug?: { current?: string };
      }
    | undefined;
  const categorySlug = document?.slug?.current;
  const categoryTitle = document?.title ?? categorySlug;

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [reassignTo, setReassignTo] = useState(CLEAR_CATEGORY_VALUE);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) {
      return;
    }

    let cancelled = false;

    async function load() {
      const [categoryRows, count] = await Promise.all([
        client.fetch<CategoryOption[]>(
          `*[_type == "galleryCategory" && slug.current != $slug] | order(coalesce(sortOrder, 999) asc, title asc) {
            title,
            "slug": slug.current
          }`,
          { slug: categorySlug },
        ),
        client.fetch<number>(
          `count(*[_type == "photo" && category == $slug])`,
          { slug: categorySlug },
        ),
      ]);

      if (cancelled) {
        return;
      }

      setCategories(categoryRows.filter((row) => Boolean(row.slug)));
      setPhotoCount(count);
      setReassignTo(
        categoryRows[0]?.slug ? categoryRows[0].slug : CLEAR_CATEGORY_VALUE,
      );
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [categorySlug, client]);

  const handleDelete = useCallback(async () => {
    if (!categorySlug) {
      setError("This category has no slug yet. Save it before deleting.");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const photoIds = await client.fetch<string[]>(
        `*[_type == "photo" && category == $slug]._id`,
        { slug: categorySlug },
      );

      const nextCategory =
        reassignTo === CLEAR_CATEGORY_VALUE ? "" : reassignTo;

      const transaction = client.transaction();

      for (const photoId of photoIds) {
        transaction.patch(photoId, (patch) =>
          patch.set({ category: nextCategory }),
        );
      }

      const publishedId = id.replace(/^drafts\./, "");
      transaction.delete(publishedId);
      transaction.delete(`drafts.${publishedId}`);

      await transaction.commit();

      onComplete();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete this category.",
      );
      setIsDeleting(false);
    }
  }, [categorySlug, client, id, onComplete, reassignTo]);

  if (!categorySlug) {
    return (
      <Card padding={4} sizing="border">
        <Text>Add a slug to this category before deleting it.</Text>
        <Box marginTop={4}>
          <Button text="Close" mode="ghost" onClick={onClose} />
        </Box>
      </Card>
    );
  }

  return (
    <Card padding={4} sizing="border">
      <Stack space={4}>
        <Stack space={2}>
          <Text weight="semibold" size={2}>
            Delete “{categoryTitle}”?
          </Text>
          <Text muted size={1}>
            {photoCount === 0
              ? "No photos use this category."
              : `${photoCount} photo${photoCount === 1 ? "" : "s"} use this category.`}{" "}
            Choose where those photos should go, then the category will be removed
            permanently.
          </Text>
        </Stack>

        {photoCount > 0 ? (
          <Stack space={2}>
            <Text size={1} weight="medium">
              Move photos to
            </Text>
            <Select
              id="reassign-category"
              value={reassignTo}
              onChange={(event) => setReassignTo(event.currentTarget.value)}
            >
              <option value={CLEAR_CATEGORY_VALUE}>
                No category (hidden from site until reassigned)
              </option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </Select>
          </Stack>
        ) : null}

        {error ? (
          <Text size={1} style={{ color: "var(--card-badge-critical-fg-color)" }}>
            {error}
          </Text>
        ) : null}

        <Flex gap={2} justify="flex-end">
          <Button
            text="Cancel"
            mode="ghost"
            onClick={onClose}
            disabled={isDeleting}
          />
          <Button
            text="Delete category"
            tone="critical"
            onClick={() => void handleDelete()}
            loading={isDeleting}
          />
        </Flex>
      </Stack>
    </Card>
  );
}

export const DeleteGalleryCategoryAction: DocumentActionComponent = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { type } = props;

  if (type !== "galleryCategory") {
    return null;
  }

  return {
    label: "Delete category",
    tone: "critical",
    icon: TrashIcon,
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen && {
      type: "dialog",
      onClose: () => setDialogOpen(false),
      content: (
        <DeleteGalleryCategoryDialog
          {...props}
          onClose={() => setDialogOpen(false)}
        />
      ),
    },
  };
};
