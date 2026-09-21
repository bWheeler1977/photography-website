function sanitizeDownloadFilename(title: string): string {
  const sanitized = title
    .trim()
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || "photo";
}

function extensionForMimeType(mimeType: string): string {
  if (mimeType.includes("png")) {
    return "png";
  }

  if (mimeType.includes("webp")) {
    return "webp";
  }

  return "jpg";
}

export async function downloadPhoto(
  imageUrl: string,
  title: string,
): Promise<void> {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Download failed");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `${sanitizeDownloadFilename(title)}.${extensionForMimeType(blob.type)}`;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}
