import type { Metadata } from "next";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { getPrintProducts } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Print Shop",
  description: "Purchase fine art photography prints.",
};

export default async function ShopPage() {
  const products = await getPrintProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Print Shop</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Fine Art Prints
        </h1>
        <p className="mt-4 text-lg text-muted">
          Museum-quality prints on archival paper. Manage products in Sanity
          Studio; Stripe checkout will be wired up next.
        </p>
      </header>
      <ShopGrid products={products} />
    </div>
  );
}
