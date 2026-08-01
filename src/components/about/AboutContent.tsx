"use client";

import { motion } from "motion/react";

export function AboutContent() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm uppercase tracking-[0.2em] text-muted">About</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          The story behind the lens
        </h1>
      </motion.header>

      <motion.div
        className="mt-10 space-y-6 text-lg leading-relaxed text-muted"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <p>
          PhotographySite is a portfolio and print shop built with Next.js,
          TypeScript, Tailwind CSS, and Motion. It is structured so you can
          connect your Instagram feed and sell fine art prints when you are
          ready.
        </p>
        <p>
          Replace this copy with your bio, your process, and what inspires your
          work. The layout is intentionally minimal so your images stay front
          and center.
        </p>
      </motion.div>

      <motion.section
        className="mt-16 rounded-2xl border border-border bg-surface p-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold">Coming soon</h2>
        <ul className="mt-4 space-y-3 text-muted">
          <li>Instagram feed sync via the Graph API</li>
          <li>Stripe-powered checkout for print orders</li>
          <li>Individual photo detail pages with size selection</li>
        </ul>
      </motion.section>
    </>
  );
}
