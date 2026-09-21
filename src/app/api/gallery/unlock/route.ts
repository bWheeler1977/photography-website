import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createGalleryAccessToken,
  galleryAccessCookieName,
  galleryAccessMaxAgeSeconds,
  safeComparePasswords,
} from "@/lib/galleryAccess";
import { getGalleryCategoryForUnlock } from "@/lib/galleryCategories";

type UnlockRequestBody = {
  slug?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: UnlockRequestBody;

  try {
    body = (await request.json()) as UnlockRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const slug = body.slug?.trim();
  const password = body.password ?? "";

  if (!slug || !password) {
    return NextResponse.json(
      { error: "Category and password are required." },
      { status: 400 },
    );
  }

  const category = await getGalleryCategoryForUnlock(slug);

  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  if (!category.passwordProtected) {
    return NextResponse.json({ ok: true });
  }

  const expectedPassword = category.password ?? "";

  if (!expectedPassword || !safeComparePasswords(password, expectedPassword)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = createGalleryAccessToken(slug);
  const cookieStore = await cookies();

  cookieStore.set(galleryAccessCookieName(slug), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: galleryAccessMaxAgeSeconds,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
