# PhotographySite

[![CI](https://github.com/bWheeler1977/photography-website/actions/workflows/ci.yml/badge.svg)](https://github.com/bWheeler1977/photography-website/actions/workflows/ci.yml)

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
| Sanity | Headless CMS + embedded Studio at `/studio` |

## Project structure

```
PhotographySite/
├── sanity.config.ts        # Sanity Studio config
├── sanity.cli.ts           # Sanity CLI config
├── src/
│   ├── app/
│   │   ├── (site)/         # Public site pages
│   │   ├── studio/         # Embedded Sanity Studio at /studio
│   │   └── api/
│   ├── sanity/             # Schemas, client, queries
│   ├── components/
│   └── lib/
```

## Pages

- **/** — Hero + featured gallery
- **/gallery** — Full portfolio grid
- **/shop** — Print products (checkout coming soon)
- **/about** — Bio and roadmap
- **/studio** — Sanity Studio (content management)

## Sanity CMS

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage)
2. Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

3. Add the same env vars in **Vercel** project settings
4. Run `npm run dev` and open [http://localhost:3000/studio](http://localhost:3000/studio)
5. In Studio, create **Site Settings**, **About Page**, **Photos**, and **Print Products**

The site falls back to placeholder content until Sanity is configured and populated.

### CORS for production Studio

In [sanity.io/manage](https://www.sanity.io/manage) → your project → **API** → **CORS origins**, add:

- `http://localhost:3000`
- Your Vercel production URL (e.g. `https://your-site.vercel.app`)

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
6. Optionally sync Instagram media into Sanity photo documents

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

## Deployment and CI

| Service | Role |
|---------|------|
| **Vercel** | Automatic production and preview deploys on every push/PR |
| **GitHub Actions** | Runs lint and build checks on push to `main` and on pull requests |

Vercel builds and hosts the site. GitHub Actions verifies every change passes `npm run lint` and `npm run build` before you merge.

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Notes

- Motion components use `"use client"` and live in leaf components to keep pages as Server Components where possible.
- Placeholder images are used until Sanity photos are published.
- Print products come from Sanity, with placeholder fallbacks until content exists.
