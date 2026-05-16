"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Learning } from "@/lib/types";
import { format } from "date-fns";
import { useState, useEffect } from "react";

const categoryColors: Record<string, string> = {
  "AI/ML": "text-dusty-lavender bg-dusty-lavender/15",
  "Data Engineering": "text-muted-blue bg-muted-blue/15",
  Projects: "text-sage-green bg-sage-green/15",
  Thoughts: "text-warm-mustard bg-warm-mustard/15",
  Design: "text-soft-peach bg-soft-peach/20",
  Resources: "text-dusty-pink bg-dusty-pink/15",
  Others: "text-[var(--muted)] bg-[var(--card-border)]/50",
};

export default function RecentLearnings() {
  const [learnings, setLearnings] = useState<Learning[]>([]);

  useEffect(() => {
    async function fetchLearnings() {
      const { data, error } = await supabase
        .from("learnings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      if (!error && data) setLearnings(data);
    }
    fetchLearnings();
  }, []);

  if (learnings.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h2 className="font-bold text-2xl text-[var(--foreground)] mb-2">
              Recent Learnings
            </h2>
            <p className="text-sm text-[var(--muted)]">
              pages from an evolving notebook 📓
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {learnings.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -3 }}
                className="group bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[var(--accent)]/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      categoryColors[entry.category] || "text-[var(--muted)] bg-[var(--card-border)]"
                    }`}
                  >
                    {entry.category}
                  </span>
                  <span className="text-xs text-[var(--muted)]">
                    {format(new Date(entry.created_at), "MMM d")}
                  </span>
                </div>

                <h3 className="font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {entry.title}
                </h3>

                <p className="text-sm text-[var(--muted)] line-clamp-3 mb-4 leading-relaxed">
                  {entry.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {(entry.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-[var(--muted)] bg-[var(--card-border)]/60 px-2 py-0.5 rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  {entry.link && (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/learnings"
              className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:text-[var(--foreground)] font-semibold transition-colors"
            >
              View all learnings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
