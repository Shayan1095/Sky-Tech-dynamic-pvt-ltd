"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function ServicesFinalCTA() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl font-bold text-text sm:text-4xl"
      >
        Ready to Get Started?
      </motion.h2>
      <p className="mx-auto mt-4 max-w-xl text-text/70">
        Whether you&apos;re launching your first website, scaling a
        marketing campaign, or automating business processes, SKY Tech can
        help. Let&apos;s talk about what you&apos;re trying to achieve.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} className="mt-8 inline-block">
        <Link
          href="/contact/"
          className="inline-block rounded-full bg-cta px-8 py-3.5 text-sm font-semibold text-text shadow-md transition-shadow hover:shadow-xl"
        >
          Book a Free Consultation
        </Link>
      </motion.div>
    </section>
  );
}
