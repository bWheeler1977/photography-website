import exifr from "exifr";
import {
  logCameraMetadataDebug,
  resolveCameraMetadata,
} from "@/lib/cameraMetadata";
import type { PhotoCameraMetadata } from "@/types";

const PARSE_OPTIONS = [
  { tiff: true, xmp: true, mergeOutput: true, firstChunkSize: 256 * 1024 },
  { tiff: true, mergeOutput: true, firstChunkSize: 256 * 1024 },
  true,
] as const;

export async function parseCameraMetadataFromFile(
  file: File,
  debugLabel?: string,
): Promise<PhotoCameraMetadata | undefined> {
  for (const [index, options] of PARSE_OPTIONS.entries()) {
    try {
      const exif = await exifr.parse(
        file,
        options === true ? options : options,
      );

      logCameraMetadataDebug("studio-file-exifr-attempt", {
        label: debugLabel,
        fileName: file.name,
        attempt: index + 1,
        exif,
      });

      if (!exif || typeof exif !== "object" || Object.keys(exif).length === 0) {
        continue;
      }

      const resolved = resolveCameraMetadata(
        { exif: exif as Record<string, unknown> },
        undefined,
        {
          debugLabel,
          log: true,
        },
      );

      if (resolved) {
        return resolved;
      }
    } catch (error) {
      logCameraMetadataDebug("studio-file-exifr-attempt-error", {
        label: debugLabel,
        fileName: file.name,
        attempt: index + 1,
        error: String(error),
      });
    }
  }

  return undefined;
}
