import type { PhotoCameraMetadata } from "@/types";

const DEBUG_PREFIX = "[camera-metadata]";

type SanityManualCameraMetadata = {
  cameraModel?: string;
  fStop?: string;
  exposureTime?: string;
  iso?: string;
  focalLength?: string;
  lensMaker?: string;
  lensModel?: string;
  copyright?: string;
};

export type SanityAssetMetadata = {
  exif?: Record<string, unknown> | null;
  image?: Record<string, unknown> | null;
};

type ResolveCameraMetadataOptions = {
  debugLabel?: string;
  log?: boolean;
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

  if (
    value &&
    typeof value === "object" &&
    "numerator" in value &&
    "denominator" in value
  ) {
    const numerator = toNumber(
      (value as { numerator: unknown }).numerator,
    );
    const denominator = toNumber(
      (value as { denominator: unknown }).denominator,
    );

    if (
      numerator !== undefined &&
      denominator !== undefined &&
      denominator !== 0
    ) {
      return numerator / denominator;
    }
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

function normalizeCameraModel(model: string, make?: string): string {
  const trimmedModel = model.trim();
  const trimmedMake = make?.trim();

  if (!trimmedMake || trimmedModel === trimmedMake) {
    return trimmedModel;
  }

  if (trimmedModel.startsWith(`${trimmedMake} `)) {
    return trimmedModel.slice(trimmedMake.length).trim();
  }

  return trimmedModel;
}

function buildCameraModel(
  exif: Record<string, unknown>,
  imageMeta?: Record<string, unknown> | null,
): string | undefined {
  const make =
    toStringValue(imageMeta?.Make) ??
    toStringValue(readExifValue(exif, ["Make"]));

  const model =
    toStringValue(imageMeta?.Model) ??
    toStringValue(imageMeta?.model) ??
    toStringValue(readExifValue(exif, ["Model"]));

  if (!model) return undefined;

  return normalizeCameraModel(model, make);
}

function extractCopyright(
  metadata: Record<string, unknown>,
): string | undefined {
  const direct = toStringValue(
    readExifValue(metadata, [
      "Copyright",
      "CopyrightNotice",
      "Rights",
      "Credit",
      "UsageTerms",
    ]),
  );

  if (direct) return direct;

  for (const [key, value] of Object.entries(metadata)) {
    if (/copyright|rights|credit/i.test(key)) {
      const parsed = toStringValue(value);
      if (parsed) return parsed;
    }
  }

  return undefined;
}

function metadataFromExif(
  assetMetadata?: SanityAssetMetadata | null,
): PhotoCameraMetadata {
  const exif = assetMetadata?.exif ?? undefined;
  const imageMeta = assetMetadata?.image ?? undefined;

  if (!exif && !imageMeta) return {};

  const exifRecord = exif ?? {};

  return {
    cameraModel: buildCameraModel(exifRecord, imageMeta),
    fStop: formatFStop(
      readExifValue(exifRecord, ["FNumber", "ApertureValue", "MaxApertureValue"]),
    ),
    exposureTime: formatExposureTime(
      readExifValue(exifRecord, [
        "ExposureTime",
        "ShutterSpeedValue",
        "ExposureTimeValue",
      ]),
    ),
    iso: formatIso(
      readExifValue(exifRecord, [
        "ISO",
        "ISOSpeedRatings",
        "PhotographicSensitivity",
        "RecommendedExposureIndex",
      ]),
    ),
    focalLength: formatFocalLength(
      readExifValue(exifRecord, ["FocalLength", "FocalLengthIn35mmFormat"]),
    ),
    lensMaker: toStringValue(readExifValue(exifRecord, ["LensMake", "Make"])),
    lensModel: toStringValue(readExifValue(exifRecord, ["LensModel"])),
    copyright:
      extractCopyright(exifRecord) ??
      (imageMeta ? extractCopyright(imageMeta) : undefined),
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
    copyright: manual?.copyright ?? fromExif.copyright,
  };

  return hasCameraMetadata(merged) ? merged : undefined;
}

export function hasCameraMetadata(
  metadata?: PhotoCameraMetadata | Record<string, string | undefined> | null,
): metadata is PhotoCameraMetadata {
  if (!metadata) return false;

  return Object.values(metadata).some(
    (value) => typeof value === "string" && value.trim() !== "",
  );
}

export function logCameraMetadataDebug(
  stage: string,
  payload: Record<string, unknown>,
) {
  console.log(DEBUG_PREFIX, stage, payload);
}

export function resolveCameraMetadata(
  assetMetadata?: SanityAssetMetadata | null,
  manual?: SanityManualCameraMetadata,
  options?: ResolveCameraMetadataOptions,
): PhotoCameraMetadata | undefined {
  const fromExif = metadataFromExif(assetMetadata);
  const merged = mergeCameraMetadata(fromExif, manual);

  if (options?.log) {
    logCameraMetadataDebug("resolve", {
      label: options.debugLabel,
      assetMetadata,
      manualCameraMetadata: manual,
      parsedFromAsset: fromExif,
      resolved: merged,
    });
  }

  return merged;
}

export function buildCameraMetadataPatch(
  resolved: PhotoCameraMetadata,
  current?: SanityManualCameraMetadata | null,
  options?: { overwrite?: boolean },
): SanityManualCameraMetadata | null {
  const patch: SanityManualCameraMetadata = {};
  const fields = [
    "cameraModel",
    "fStop",
    "exposureTime",
    "iso",
    "focalLength",
    "lensMaker",
    "lensModel",
    "copyright",
  ] as const;

  for (const field of fields) {
    const currentValue = current?.[field]?.trim();
    const resolvedValue = resolved[field]?.trim();

    if (!resolvedValue) continue;

    if (options?.overwrite) {
      if (resolvedValue !== currentValue) {
        patch[field] = resolvedValue;
      }
      continue;
    }

    if (!currentValue) {
      patch[field] = resolvedValue;
    }
  }

  return Object.keys(patch).length > 0 ? patch : null;
}

export function isPngFile(file: Pick<File, "name" | "type">): boolean {
  return (
    file.type === "image/png" || file.name.toLowerCase().endsWith(".png")
  );
}

export function isJpegFile(file: Pick<File, "name" | "type">): boolean {
  return (
    file.type === "image/jpeg" ||
    /\.jpe?g$/i.test(file.name)
  );
}

export function extractLoggedExifTags(
  exif: Record<string, unknown>,
): Record<string, unknown> {
  const keys = [
    "Make",
    "Model",
    "FNumber",
    "ExposureTime",
    "ISO",
    "ISOSpeedRatings",
    "FocalLength",
    "LensMake",
    "LensModel",
    "Copyright",
    "CopyrightNotice",
    "Credit",
    "Rights",
    "UsageTerms",
    "Artist",
  ];

  const logged: Record<string, unknown> = {};
  for (const key of keys) {
    const value = exif[key];
    if (value !== undefined && value !== null && value !== "") {
      logged[key] = value;
    }
  }

  return logged;
}
