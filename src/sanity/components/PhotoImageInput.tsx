"use client";

import { useEffect, useRef } from "react";
import type { ImageValue, ObjectInputProps } from "sanity";
import { useClient, useFormValue } from "sanity";
import {
  buildCameraMetadataPatch,
  logCameraMetadataDebug,
  resolveCameraMetadata,
  type SanityAssetMetadata,
} from "@/lib/cameraMetadata";

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

export function PhotoImageInput(props: ObjectInputProps<ImageValue>) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const documentId = useFormValue(["_id"]) as string | undefined;
  const photoTitle = useFormValue(["title"]) as string | undefined;
  const cameraMetadata = useFormValue(["cameraMetadata"]) as
    | Record<string, string | undefined>
    | undefined;
  const lastProcessedKey = useRef<string | null>(null);

  const assetRef = props.value?.asset?._ref;

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
            asset?.metadata?.exif || asset?.metadata?.image
              ? "EXIF/image tags were present but no supported camera fields were found."
              : "No EXIF or image metadata on this asset. JPEG originals usually retain camera data; PNG exports and re-saved edits often strip it. Re-upload the original JPEG or fill Camera metadata manually.",
          extension: asset?.extension,
          mimeType: asset?.mimeType,
        });
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

      if (!documentId) {
        logCameraMetadataDebug("studio-upload-patch-skipped", {
          photoTitle,
          assetRef,
          patch,
          reason:
            "Document has not been created yet. Save the photo once, then touch the image field again to auto-fill metadata.",
        });
        lastProcessedKey.current = processKey;
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

      if (cancelled) return;

      logCameraMetadataDebug("studio-upload-autofill", {
        photoTitle,
        documentId,
        assetRef,
        patch,
      });

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
    assetRef,
    cameraMetadata,
    client,
    documentId,
    photoTitle,
  ]);

  return props.renderDefault(props);
}
