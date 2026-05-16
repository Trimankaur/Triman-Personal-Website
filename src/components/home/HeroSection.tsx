"use client";

import { motion } from "framer-motion";
import { BookOpen, Coffee } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/Avatar";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Soft ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-[var(--accent-light)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-warm-mustard/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-dusty-pink/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
            className="mb-6"
          >
            <Avatar size="2xl" />
          </motion.div>

          <motion.p
            className="text-lg text-[var(--muted)] mb-3 tracking-wide font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Hey, I&apos;m Triman 👋
          </motion.p>

          <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl leading-tight text-[var(--foreground)] mb-5">
            Just a self-learner trying to keep up with AI,{" "}
            <span className="text-[var(--accent)]">documenting what I learn</span> as I go.
          </h1>

          <motion.p
            className="text-lg text-[var(--muted)] mb-10 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            A little log of what I&apos;m exploring.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link
              href="/learnings"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[var(--card-border)] text-[var(--foreground)] text-sm font-semibold hover:bg-[var(--card-border)]/30 hover:border-[var(--accent)]/30 active:scale-95 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Things I&apos;ve been learning
            </Link>
            <Link
              href="/study-room"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[var(--card-border)] text-[var(--foreground)] text-sm font-semibold hover:bg-[var(--card-border)]/30 hover:border-[var(--accent)]/30 active:scale-95 transition-all"
            >
              <Coffee className="h-4 w-4" />
              Join my study room
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
