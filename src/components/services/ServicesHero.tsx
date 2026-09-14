"use client";

import { motion } from "motion/react";

export default function ServicesHero() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-4xl font-bold tracking-tight text-text sm:text-5xl"
      >
        Everything Your Business Needs to Build, Launch & Grow
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="mx-auto mt-6 max-w-2xl text-lg text-text/70"
      >
        At SKY Tech, we don&apos;t offer a one-size-fits-all approach.
        Whether you need a website, marketing strategy, or custom
        automation, our services are built around your business goals — not
        a preset template.
      </motion.p>
    </section>
  );
}
