import type { PrintProduct } from "@/types";

type CheckoutItem = {
  productId: string;
  sizeId: string;
  quantity: number;
};

type CheckoutSession = {
  url: string;
};

/**
 * Create a Stripe Checkout session for print purchases.
 * Wire up when STRIPE_SECRET_KEY is configured.
 *
 * @see https://stripe.com/docs/checkout/quickstart
 */
export async function createCheckoutSession(
  items: CheckoutItem[],
): Promise<CheckoutSession> {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY in your environment.",
    );
  }

  // Placeholder — replace with Stripe SDK call
  void items;
  throw new Error("Stripe checkout is not yet implemented.");
}

export function buildLineItems(
  items: CheckoutItem[],
  products: PrintProduct[],
) {
  return items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const size = product?.sizes.find((s) => s.id === item.sizeId);

    if (!product || !size) {
      throw new Error(`Invalid cart item: ${item.productId}`);
    }

    return {
      name: `${product.title} — ${size.label}`,
      unitAmount: size.priceCents,
      quantity: item.quantity,
    };
  });
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
