"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { PrintProduct } from "@/types";
import { formatPrice } from "@/lib/shop";

type ShopGridProps = {
  products: PrintProduct[];
};

export function ShopGrid({ products }: ShopGridProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <motion.article
          key={product.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: index * 0.08 }}
        >
          <div className="relative aspect-[4/5]">
            <Image
              src={product.imageSrc}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h2 className="text-lg font-medium">{product.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{product.description}</p>
            <p className="mt-4 text-sm">
              From{" "}
              <span className="font-semibold">
                {formatPrice(product.priceCents)}
              </span>
            </p>
            <button
              type="button"
              disabled
              className="mt-5 w-full cursor-not-allowed rounded-full border border-border px-4 py-2.5 text-sm text-muted"
              title="Checkout coming soon"
            >
              Add to cart (coming soon)
            </button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
