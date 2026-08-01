# PhotographySite

A photography portfolio and print shop built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Motion**.

## Getting started

Requires [Node.js](https://nodejs.org/) 18.18 or later.

```bash
cd PhotographySite
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 | App Router, SSR, API routes |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Motion | Animations (`motion/react`) |

## Project structure

```
src/
├── app/                    # App Router pages & API routes
│   ├── api/
│   │   ├── instagram/      # Instagram feed endpoint (stub)
│   │   └── checkout/       # Stripe checkout endpoint (stub)
│   ├── gallery/
│   ├── shop/
│   └── about/
├── components/             # UI components (Motion in client components)
├── lib/
│   ├── instagram/          # Instagram Graph API client
│   ├── shop/               # Checkout helpers
│   └── photos.ts           # Placeholder photo data
└── types/                  # Shared TypeScript types
```

## Pages

- **/** — Hero + featured gallery
- **/gallery** — Full portfolio grid
- **/shop** — Print products (checkout coming soon)
- **/about** — Bio and roadmap

## Future integrations

### Instagram

1. Create a [Meta for Developers](https://developers.facebook.com/) app
2. Connect an Instagram Business/Creator account
3. Generate a long-lived access token
4. Copy `.env.example` to `.env.local` and set:

```env
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_USER_ID=your_user_id
```

5. Hit `GET /api/instagram` to verify the connection
6. Swap placeholder photos in `src/lib/photos.ts` with data from `src/lib/instagram/client.ts`

### E-commerce (Stripe)

1. Create a [Stripe](https://stripe.com) account
2. Add keys to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Implement `createCheckoutSession` in `src/lib/shop/checkout.ts`
4. Wire the shop UI to `POST /api/checkout`

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Notes

- Motion components use `"use client"` and live in leaf components to keep pages as Server Components where possible.
- Placeholder images come from Unsplash. Replace with your own assets or Instagram media.
- Print products are derived from featured photos until a real product catalog is added.
