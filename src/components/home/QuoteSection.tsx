"use client";

import { motion } from "framer-motion";
import { Quote, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Quote as QuoteType } from "@/lib/types";
import { useState, useEffect } from "react";

export default function QuoteSection() {
  const [quote, setQuote] = useState<QuoteType | null>(null);

  useEffect(() => {
    async function fetchQuote() {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data && data.length > 0) {
        // Pick one based on day of year
        const dayOfYear = Math.floor(
          (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
        );
        setQuote(data[dayOfYear % data.length]);
      }
    }
    fetchQuote();
  }, []);

  if (!quote) return null;

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-bold text-2xl text-[var(--foreground)] mb-2">
            Words I Keep Returning To
          </h2>
          <p className="text-sm text-[var(--muted)] mb-10">
            little things that keep me going 💭
          </p>

          <div className="relative bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-8 sm:p-12 shadow-sm">
            <Quote className="absolute top-6 left-6 h-8 w-8 text-[var(--accent)]/20" />

            <blockquote className="font-bold text-xl sm:text-2xl text-[var(--foreground)] leading-relaxed mb-6">
              &ldquo;{quote.quote}&rdquo;
            </blockquote>

            <p className="text-sm text-[var(--muted)] font-medium">&mdash; {quote.author}</p>

            {quote.personal_note && (
              <p className="mt-4 text-sm text-[var(--accent)] italic">
                💭 {quote.personal_note}
              </p>
            )}
          </div>

          <Link
            href="/quotes"
            className="inline-flex items-center gap-2 mt-8 text-sm text-[var(--accent)] hover:text-[var(--foreground)] font-semibold transition-colors"
          >
            Browse the words that stay with me
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
