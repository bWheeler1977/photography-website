import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ACCESS_TTL_MS = 30 * 60 * 1000;
const COOKIE_PREFIX = "gallery_access_";

function getGalleryAccessSecret(): string {
  const secret = process.env.GALLERY_ACCESS_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === "development") {
    return "development-gallery-access-secret";
  }

  throw new Error("GALLERY_ACCESS_SECRET is not configured");
}

export function galleryAccessCookieName(categorySlug: string): string {
  return `${COOKIE_PREFIX}${categorySlug}`;
}

export function createGalleryAccessToken(categorySlug: string): string {
  const expiresAt = Date.now() + ACCESS_TTL_MS;
  const payload = `${categorySlug}:${expiresAt}`;
  const signature = createHmac("sha256", getGalleryAccessSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function verifyGalleryAccessToken(
  categorySlug: string,
  token: string | undefined,
): boolean {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const [tokenSlug, expiresAtRaw] = payload.split(":");

  if (tokenSlug !== categorySlug) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const expectedSignature = createHmac("sha256", getGalleryAccessSecret())
    .update(payload)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(signatureBuffer, expectedBuffer);
}

export async function hasGalleryAccess(categorySlug: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(galleryAccessCookieName(categorySlug))?.value;

  return verifyGalleryAccessToken(categorySlug, token);
}

export function safeComparePasswords(
  provided: string,
  expected: string,
): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export const galleryAccessMaxAgeSeconds = ACCESS_TTL_MS / 1000;
