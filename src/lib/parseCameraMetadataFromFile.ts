import exifr from "exifr";
import {
  extractLoggedExifTags,
  logCameraMetadataDebug,
  resolveCameraMetadata,
} from "@/lib/cameraMetadata";
import type { PhotoCameraMetadata } from "@/types";

const PARSE_OPTIONS = [
  { tiff: true, xmp: true, iptc: true, mergeOutput: true, firstChunkSize: 256 * 1024 },
  { tiff: true, xmp: true, iptc: true, mergeOutput: true, firstChunkSize: 512 * 1024 },
  { tiff: true, xmp: true, mergeOutput: true, firstChunkSize: 256 * 1024 },
  true,
] as const;

export async function parseCameraMetadataFromFile(
  file: File,
  debugLabel?: string,
): Promise<PhotoCameraMetadata | undefined> {
  logCameraMetadataDebug("studio-file-parse-start", {
    label: debugLabel,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });

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
        options: options === true ? "all" : options,
        exif,
        knownTags:
          exif && typeof exif === "object"
            ? extractLoggedExifTags(exif as Record<string, unknown>)
            : null,
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
        logCameraMetadataDebug("studio-file-parse-success", {
          label: debugLabel,
          fileName: file.name,
          attempt: index + 1,
          resolved,
        });
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

  logCameraMetadataDebug("studio-file-parse-empty", {
    label: debugLabel,
    fileName: file.name,
    message: "No usable camera metadata was found in the selected file.",
  });

  return undefined;
}
