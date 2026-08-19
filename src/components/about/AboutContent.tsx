"use client";

import { motion } from "motion/react";
import type { AboutPageContent } from "@/types";

type AboutContentProps = {
  about: AboutPageContent;
};

export function AboutContent({ about }: AboutContentProps) {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm uppercase tracking-[0.2em] text-muted">About</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          {about.title}
        </h1>
      </motion.header>

      <motion.div
        className="mt-10 space-y-6 text-lg leading-relaxed text-muted"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </motion.div>

      {about.roadmapItems.length > 0 && (
        <motion.section
          className="mt-16 rounded-2xl border border-border bg-surface p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold">{about.roadmapTitle}</h2>
          <ul className="mt-4 space-y-3 text-muted">
            {about.roadmapItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </motion.section>
      )}
    </>
  );
}
