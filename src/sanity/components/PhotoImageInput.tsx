"use client";

import { Card, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageValue, ObjectInputProps } from "sanity";
import { useClient, useFormValue } from "sanity";
import {
  buildCameraMetadataPatch,
  hasCameraMetadata,
  logCameraMetadataDebug,
  resolveCameraMetadata,
  type SanityAssetMetadata,
} from "@/lib/cameraMetadata";
import { parseCameraMetadataFromFile } from "@/lib/parseCameraMetadataFromFile";

type AssetMetadataResponse = SanityAssetMetadata & {
  dimensions?: {
    width?: number;
    height?: number;
  };
};

type AssetDetailsResponse = {
  extension?: string;
  mimeType?: string;
  originalFilename?: string;
  metadata?: AssetMetadataResponse;
};

type MetadataPatch = Record<string, string>;

const MANUAL_METADATA_HINT =
  "Auto-detect did not find camera metadata in this file. You can copy values from the image file properties on your computer into the Camera metadata fields below.";

export function PhotoImageInput(props: ObjectInputProps<ImageValue>) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const documentId = useFormValue(["_id"]) as string | undefined;
  const photoTitle = useFormValue(["title"]) as string | undefined;
  const cameraMetadata = useFormValue(["cameraMetadata"]) as
    | Record<string, string | undefined>
    | undefined;

  const containerRef = useRef<HTMLDivElement>(null);
  const lastProcessedKey = useRef<string | null>(null);
  const pendingPatchRef = useRef<MetadataPatch | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const assetRef = props.value?.asset?._ref;
  const hasManualMetadata = hasCameraMetadata(cameraMetadata);

  const applyMetadataPatch = useCallback(
    async (patch: MetadataPatch, source: string) => {
      if (!documentId) {
        pendingPatchRef.current = patch;
        logCameraMetadataDebug("studio-upload-patch-pending", {
          photoTitle,
          source,
          patch,
          reason:
            "Document is still being created. Save the photo and metadata will auto-fill on the next save.",
        });
        return;
      }

      await client
        .patch(documentId)
        .set({
          cameraMetadata: {
            ...(cameraMetadata ?? {}),
            ...patch,
          },
        })
        .commit();

      logCameraMetadataDebug("studio-upload-autofill", {
        photoTitle,
        documentId,
        source,
        patch,
      });

      setUploadNotice(null);
    },
    [cameraMetadata, client, documentId, photoTitle],
  );

  useEffect(() => {
    if (!pendingPatchRef.current || !documentId) {
      return;
    }

    const patch = pendingPatchRef.current;
    pendingPatchRef.current = null;

    applyMetadataPatch(patch, "pending-after-save").catch((error) => {
      console.error("[camera-metadata] studio-upload-error", {
        photoTitle,
        error,
      });
    });
  }, [applyMetadataPatch, documentId, photoTitle]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const handleFileChange = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      logCameraMetadataDebug("studio-file-selected", {
        photoTitle,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      setUploadNotice(null);

      const resolved = await parseCameraMetadataFromFile(file, photoTitle);

      if (!resolved) {
        if (!hasManualMetadata) {
          setUploadNotice(MANUAL_METADATA_HINT);
        }

        logCameraMetadataDebug("studio-file-no-metadata", {
          photoTitle,
          fileName: file.name,
          message: MANUAL_METADATA_HINT,
        });
        return;
      }

      const patch = buildCameraMetadataPatch(resolved, cameraMetadata);
      if (!patch) {
        logCameraMetadataDebug("studio-file-no-patch", {
          photoTitle,
          fileName: file.name,
          resolved,
        });
        return;
      }

      await applyMetadataPatch(patch, "local-file-exifr");
    };

    const attachListener = (input: HTMLInputElement) => {
      input.addEventListener("change", handleFileChange);
      return () => input.removeEventListener("change", handleFileChange);
    };

    const existingInput = root.querySelector('input[type="file"]');
    let detach = existingInput
      ? attachListener(existingInput as HTMLInputElement)
      : undefined;

    const observer = new MutationObserver(() => {
      detach?.();
      const input = root.querySelector('input[type="file"]');
      detach = input ? attachListener(input as HTMLInputElement) : undefined;
    });

    observer.observe(root, { childList: true, subtree: true });

    return () => {
      detach?.();
      observer.disconnect();
    };
  }, [applyMetadataPatch, cameraMetadata, hasManualMetadata, photoTitle]);

  useEffect(() => {
    if (!assetRef) {
      lastProcessedKey.current = null;
      return;
    }

    const processKey = `${assetRef}:${documentId ?? "no-doc"}`;
    if (lastProcessedKey.current === processKey) {
      return;
    }

    let cancelled = false;

    async function inspectUploadedAsset() {
      logCameraMetadataDebug("studio-upload-start", {
        photoTitle,
        documentId,
        assetRef,
      });

      const asset = await client.fetch<AssetDetailsResponse | null>(
        `*[_id == $id][0]{
          extension,
          mimeType,
          originalFilename,
          metadata {
            exif,
            image,
            dimensions
          }
        }`,
        { id: assetRef },
      );

      if (cancelled) return;

      logCameraMetadataDebug("studio-upload-asset", {
        photoTitle,
        assetRef,
        extension: asset?.extension,
        mimeType: asset?.mimeType,
        originalFilename: asset?.originalFilename,
        metadata: asset?.metadata,
      });

      const resolved = resolveCameraMetadata(asset?.metadata, cameraMetadata, {
        debugLabel: photoTitle,
        log: true,
      });

      if (!resolved) {
        logCameraMetadataDebug("studio-upload-empty", {
          photoTitle,
          assetRef,
          reason:
            "Sanity did not store camera metadata on this asset. Use the Camera metadata fields below if auto-detect did not fill them.",
          extension: asset?.extension,
          mimeType: asset?.mimeType,
        });

        if (!hasManualMetadata) {
          setUploadNotice(MANUAL_METADATA_HINT);
        }

        lastProcessedKey.current = processKey;
        return;
      }

      const patch = buildCameraMetadataPatch(resolved, cameraMetadata);

      if (!patch) {
        logCameraMetadataDebug("studio-upload-no-patch", {
          photoTitle,
          assetRef,
          resolved,
          message:
            "Camera metadata was parsed, but all document fields are already filled.",
        });
        lastProcessedKey.current = processKey;
        return;
      }

      await applyMetadataPatch(patch, "sanity-asset-metadata");
      lastProcessedKey.current = processKey;
    }

    inspectUploadedAsset().catch((error) => {
      console.error("[camera-metadata] studio-upload-error", {
        photoTitle,
        assetRef,
        error,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [
    applyMetadataPatch,
    assetRef,
    cameraMetadata,
    client,
    documentId,
    hasManualMetadata,
    photoTitle,
  ]);

  useEffect(() => {
    if (hasManualMetadata) {
      setUploadNotice(null);
    }
  }, [hasManualMetadata]);

  return (
    <Stack space={3}>
      {uploadNotice && (
        <Card padding={3} radius={2} shadow={1} tone="primary">
          <Text size={1}>{uploadNotice}</Text>
        </Card>
      )}
      <div ref={containerRef}>{props.renderDefault(props)}</div>
    </Stack>
  );
}
