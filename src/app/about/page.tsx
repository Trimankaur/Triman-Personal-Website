"use client";

import { motion } from "framer-motion";
import { Heart, BookOpen, Code, Lightbulb, Sparkles } from "lucide-react";
import Avatar from "@/components/Avatar";

export default function AboutPage() {
  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header with Avatar */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="mb-4"
            >
              <Avatar size="xl" />
            </motion.div>
            <h1 className="font-extrabold text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
              About This Space 🏡
            </h1>
            <p className="text-[var(--muted)]">
              part journal, part learning archive, part proof that I kept showing up
            </p>
          </div>

          {/* Story cards */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-dusty-pink" />
                <span className="text-xs text-[var(--muted)] uppercase tracking-wide font-bold">
                  The beginning
                </span>
              </div>
              <p className="text-[var(--muted)] leading-relaxed">
                Hey, I&apos;m Triman. I&apos;m someone who wakes up curious every day and tries to
                learn something meaningful before the day ends.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-warm-mustard" />
                <span className="text-xs text-[var(--muted)] uppercase tracking-wide font-bold">
                  The curiosity
                </span>
              </div>
              <p className="text-[var(--muted)] leading-relaxed">
                AI fascinates me. Not because it&apos;s trendy, but because it feels like
                watching a new kind of intelligence emerge in real time. I want to understand
                it deeply, not just use it superficially. Every paper I read, every model I
                tinker with, every pipeline I build brings me a little closer.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-4 w-4 text-sage-green" />
                <span className="text-xs text-[var(--muted)] uppercase tracking-wide font-bold">
                  The building
                </span>
              </div>
              <p className="text-[var(--muted)] leading-relaxed">
                I believe you don&apos;t truly understand something until you&apos;ve built it.
                That&apos;s why this space exists. It&apos;s my proof of work. Not polished
                portfolios or impressive credentials, but honest documentation of someone
                figuring things out one day at a time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-dusty-lavender" />
                <span className="text-xs text-[var(--muted)] uppercase tracking-wide font-bold">
                  The documenting
                </span>
              </div>
              <p className="text-[var(--muted)] leading-relaxed">
                Learning in public is vulnerable. You share your half-formed thoughts, your
                mistakes, your &ldquo;aha&rdquo; moments. But there&apos;s something powerful about it.
                It creates accountability, builds community, and turns a solitary journey
                into a shared one.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-muted-orange" />
                <span className="text-xs text-[var(--muted)] uppercase tracking-wide font-bold">
                  The balance
                </span>
              </div>
              <p className="text-[var(--muted)] leading-relaxed">
                I live somewhere between creativity and technical thinking. I care about
                beautiful interfaces as much as clean architectures. I think the best
                technology feels warm, not cold. And I believe the journey of learning is
                just as valuable as the destination of expertise.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* LinkedIn - fixed bottom right, just above footer */}
      <div className="fixed bottom-12 right-6 z-40">
        <a
          href="https://www.linkedin.com/in/trimankaur"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--card-border)] shadow-md text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
