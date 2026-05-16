"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Quote as QuoteType } from "@/lib/types";
import { useState, useEffect } from "react";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setQuotes(data);
      setLoading(false);
    }
    fetchQuotes();
  }, []);
  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-extrabold text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
            Words I Keep Returning To 📖
          </h1>
          <p className="text-[var(--muted)]">
            little things that keep me going 💭
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-16">
            <p className="text-[var(--muted)]">Loading...</p>
          </div>
        )}

        {!loading && quotes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--muted)] text-lg">No quotes yet</p>
            <p className="text-sm text-[var(--muted)] mt-1">Add some from the admin dashboard</p>
          </div>
        )}

        <div className="space-y-5">
          {quotes.map((quote, i) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -2 }}
              className="relative bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-[var(--accent)]/20 transition-all"
            >
              <Quote className="absolute top-4 right-4 h-6 w-6 text-[var(--accent)]/15" />

              <blockquote className="font-bold text-lg sm:text-xl text-[var(--foreground)] leading-relaxed mb-4">
                &ldquo;{quote.quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted)] font-medium">— {quote.author}</p>
                {quote.category && (
                  <span className="text-xs px-2.5 py-1 rounded-xl bg-[var(--accent-light)]/20 text-[var(--accent)] font-semibold">
                    {quote.category}
                  </span>
                )}
              </div>

              {quote.personal_note && (
                <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                  <p className="text-sm text-[var(--accent)] italic">
                    💭 {quote.personal_note}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
