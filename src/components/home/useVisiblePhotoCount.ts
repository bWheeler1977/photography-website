"use client";

import { useEffect, useState } from "react";

function getVisiblePhotoCount(): number {
  if (typeof window === "undefined") {
    return 3;
  }

  const width = window.innerWidth;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  if (width < 768) {
    return 1;
  }

  if (width < 1024 && isPortrait) {
    return 2;
  }

  return 3;
}

export function useVisiblePhotoCount(): number {
  const [visibleCount, setVisibleCount] = useState(getVisiblePhotoCount);

  useEffect(() => {
    const updateVisibleCount = () => setVisibleCount(getVisiblePhotoCount());

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    window.addEventListener("orientationchange", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
      window.removeEventListener("orientationchange", updateVisibleCount);
    };
  }, []);

  return visibleCount;
}
