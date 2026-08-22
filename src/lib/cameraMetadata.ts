import type { PhotoCameraMetadata } from "@/types";

type SanityManualCameraMetadata = {
  cameraModel?: string;
  fStop?: string;
  exposureTime?: string;
  iso?: string;
  focalLength?: string;
  lensMaker?: string;
  lensModel?: string;
};

type SanityAssetMetadata = {
  exif?: Record<string, unknown>;
  image?: Record<string, unknown>;
};

function readExifValue(
  exif: Record<string, unknown>,
  keys: string[],
): unknown {
  for (const key of keys) {
    const value = exif[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (Array.isArray(value) && value.length > 0) {
    return toStringValue(value[0]);
  }

  return undefined;
}

function formatFStop(value: unknown): string | undefined {
  const number = toNumber(value);
  if (number === undefined) return undefined;

  const formatted = Number(number.toFixed(1));
  return `f/${formatted}`;
}

function formatExposureTime(value: unknown): string | undefined {
  const number = toNumber(value);
  if (number === undefined) return undefined;

  if (number >= 1) {
    return `${Number(number.toFixed(1))}s`;
  }

  const denominator = Math.round(1 / number);
  return `1/${denominator}s`;
}

function formatIso(value: unknown): string | undefined {
  const number = toNumber(value);
  if (number === undefined) return undefined;
  return String(Math.round(number));
}

function formatFocalLength(value: unknown): string | undefined {
  const number = toNumber(value);
  if (number === undefined) return undefined;
  return `${Math.round(number)}mm`;
}

function buildCameraModel(
  exif: Record<string, unknown>,
  imageMeta?: Record<string, unknown>,
): string | undefined {
  const make =
    toStringValue(readExifValue(exif, ["Make"])) ??
    toStringValue(imageMeta?.make);
  const model =
    toStringValue(readExifValue(exif, ["Model"])) ??
    toStringValue(imageMeta?.model);

  if (make && model) {
    return model.startsWith(make) ? model : `${make} ${model}`;
  }

  return model ?? make;
}

function metadataFromExif(
  assetMetadata?: SanityAssetMetadata,
): PhotoCameraMetadata {
  const exif = assetMetadata?.exif;
  if (!exif) return {};

  const imageMeta = assetMetadata.image;

  return {
    cameraModel: buildCameraModel(exif, imageMeta),
    fStop: formatFStop(readExifValue(exif, ["FNumber", "ApertureValue"])),
    exposureTime: formatExposureTime(
      readExifValue(exif, ["ExposureTime", "ShutterSpeedValue"]),
    ),
    iso: formatIso(
      readExifValue(exif, [
        "ISOSpeedRatings",
        "PhotographicSensitivity",
        "ISO",
      ]),
    ),
    focalLength: formatFocalLength(readExifValue(exif, ["FocalLength"])),
    lensMaker: toStringValue(readExifValue(exif, ["LensMake"])),
    lensModel: toStringValue(readExifValue(exif, ["LensModel"])),
  };
}

function mergeCameraMetadata(
  fromExif: PhotoCameraMetadata,
  manual?: SanityManualCameraMetadata,
): PhotoCameraMetadata | undefined {
  const merged: PhotoCameraMetadata = {
    cameraModel: manual?.cameraModel ?? fromExif.cameraModel,
    fStop: manual?.fStop ?? fromExif.fStop,
    exposureTime: manual?.exposureTime ?? fromExif.exposureTime,
    iso: manual?.iso ?? fromExif.iso,
    focalLength: manual?.focalLength ?? fromExif.focalLength,
    lensMaker: manual?.lensMaker ?? fromExif.lensMaker,
    lensModel: manual?.lensModel ?? fromExif.lensModel,
  };

  return hasCameraMetadata(merged) ? merged : undefined;
}

export function hasCameraMetadata(
  metadata?: PhotoCameraMetadata,
): metadata is PhotoCameraMetadata {
  if (!metadata) return false;

  return Object.values(metadata).some(
    (value) => value !== undefined && value.trim() !== "",
  );
}

export function resolveCameraMetadata(
  assetMetadata?: SanityAssetMetadata,
  manual?: SanityManualCameraMetadata,
): PhotoCameraMetadata | undefined {
  return mergeCameraMetadata(metadataFromExif(assetMetadata), manual);
}
