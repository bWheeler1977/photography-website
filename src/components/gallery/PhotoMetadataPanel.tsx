"use client";

import { AnimatePresence, motion } from "motion/react";
import type { PhotoCameraMetadata } from "@/types";

type PhotoMetadataPanelProps = {
  metadata: PhotoCameraMetadata;
  isOpen: boolean;
  onClose: () => void;
};

type MetadataRow = {
  label: string;
  value: string;
};

function buildMetadataRows(metadata: PhotoCameraMetadata): MetadataRow[] {
  const rows: MetadataRow[] = [];

  if (metadata.cameraModel) {
    rows.push({ label: "Camera", value: metadata.cameraModel });
  }

  if (metadata.fStop) {
    rows.push({ label: "F-stop", value: metadata.fStop });
  }

  if (metadata.exposureTime) {
    rows.push({ label: "Exposure", value: metadata.exposureTime });
  }

  if (metadata.iso) {
    rows.push({ label: "ISO", value: metadata.iso });
  }

  if (metadata.focalLength) {
    rows.push({ label: "Focal length", value: metadata.focalLength });
  }

  if (metadata.lensMaker) {
    rows.push({ label: "Lens maker", value: metadata.lensMaker });
  }

  if (metadata.lensModel) {
    rows.push({ label: "Lens model", value: metadata.lensModel });
  }

  if (metadata.copyright) {
    rows.push({ label: "Copyright", value: metadata.copyright });
  }

  return rows;
}

export function PhotoMetadataPanel({
  metadata,
  isOpen,
  onClose,
}: PhotoMetadataPanelProps) {
  const rows = buildMetadataRows(metadata);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-x-0 bottom-0 z-20 border-t border-white/15 bg-black/80 px-4 py-3 backdrop-blur-md sm:px-5 sm:py-4"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">
              Camera details
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 p-1.5 text-white/80 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
              aria-label="Hide camera details"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
            {rows.map((row) => (
              <div key={row.label}>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-white/50">
                  {row.label}
                </dt>
                <dd className="mt-0.5 text-sm text-white/90">{row.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
