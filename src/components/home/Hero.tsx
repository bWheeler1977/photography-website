"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-start px-6 py-24 md:py-32">
        <motion.p
          className="text-sm uppercase tracking-[0.3em] text-muted"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Fine Art Photography
        </motion.p>

        <motion.h1
          className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Capturing light, mood, and the spaces in between.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl text-lg text-muted"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          A portfolio built with Next.js and Motion. Instagram feeds and print
          sales are ready to plug in when you are.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link
            href="/gallery"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:bg-accent"
          >
            View Gallery
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-border px-6 py-3 text-sm transition hover:border-accent hover:text-accent"
          >
            Shop Prints
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-zinc-800/30 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
}
