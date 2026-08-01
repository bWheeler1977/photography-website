import { NextResponse } from "next/server";
import { buildLineItems, createCheckoutSession, isStripeConfigured } from "@/lib/shop/checkout";
import { getPrintProducts } from "@/lib/shop";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local when ready.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      items?: Array<{ productId: string; sizeId: string; quantity: number }>;
    };

    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const products = getPrintProducts();
    buildLineItems(body.items, products);
    const session = await createCheckoutSession(body.items);

    return NextResponse.json(session);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
