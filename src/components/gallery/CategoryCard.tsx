"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";
import type { GalleryCategory } from "@/lib/categories";

type CategoryCardProps = {
  category: GalleryCategory;
  index: number;
};

export function CategoryCard({ category, index }: CategoryCardProps) {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProtectedClick = () => {
    setError(null);
    setIsFlipped(true);
  };

  const handleGoBack = () => {
    setError(null);
    setPassword("");
    setIsFlipped(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/gallery/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: category.slug,
          password,
        }),
      });

      let payload: { error?: string } = {};

      try {
        payload = (await response.json()) as { error?: string };
      } catch {
        payload = {};
      }

      if (!response.ok) {
        if (response.status === 404) {
          setError(
            payload.error ??
              "This gallery could not be found. Check the category in Studio and try again.",
          );
        } else {
          setError(payload.error ?? "Unable to unlock this gallery.");
        }
        return;
      }

      router.push(`/gallery/${category.slug}`);
    } catch {
      setError("Unable to unlock this gallery. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.figure
      className="h-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
    >
      <div className="gallery-flip-scene h-full">
        <div
          className={`gallery-flip-inner h-full min-h-[28rem] rounded-2xl border border-border bg-surface ${
            isFlipped ? "gallery-flip-inner--flipped" : ""
          }`}
        >
          <div className="gallery-flip-face flex h-full flex-col overflow-hidden rounded-2xl">
            {category.passwordProtected ? (
              <button
                type="button"
                onClick={handleProtectedClick}
                className="group block h-full w-full text-left"
                aria-label={`Unlock ${category.label} gallery`}
              >
                <CategoryCardFront category={category} />
              </button>
            ) : (
              <Link
                href={`/gallery/${category.slug}`}
                className="group block h-full text-left"
                aria-label={`View ${category.label} gallery`}
              >
                <CategoryCardFront category={category} />
              </Link>
            )}
          </div>

          <div className="gallery-flip-face gallery-flip-face--back h-full overflow-hidden rounded-2xl">
            <form
              onSubmit={handleSubmit}
              className="relative flex h-full flex-col"
            >
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <Image
                  src={category.coverPhoto.src}
                  alt=""
                  fill
                  className="object-cover blur-md scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-black/55" />
                <div className="relative z-10 flex h-full flex-col justify-center px-5 py-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                    Password required
                  </p>
                  <h3 className="mt-2 text-xl font-medium text-white">
                    {category.label}
                  </h3>
                  <label className="mt-6 block">
                    <span className="sr-only">Gallery password</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-white/25 bg-black/40 px-4 py-3 text-white placeholder:text-white/45 focus:border-white/60 focus:outline-none"
                      placeholder="Enter password"
                    />
                  </label>
                  {error ? (
                    <p className="mt-3 text-sm text-red-300" role="alert">
                      {error}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="relative z-10 flex gap-3 border-t border-white/10 bg-black/80 p-4">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="flex-1 rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white transition hover:border-white/40 hover:bg-white/10"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !password.trim()}
                  className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Checking…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.figure>
  );
}

function CategoryCardFront({ category }: { category: GalleryCategory }) {
  return (
    <>
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={category.coverPhoto.src}
          alt={category.coverPhoto.alt}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {category.passwordProtected ? (
          <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-black/55 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm">
            Locked
          </span>
        ) : null}
      </div>
      <figcaption className="p-4">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          {category.photoCount}{" "}
          {category.photoCount === 1 ? "photo" : "photos"}
        </p>
        <p className="mt-1 text-lg font-medium">{category.label}</p>
      </figcaption>
    </>
  );
}
