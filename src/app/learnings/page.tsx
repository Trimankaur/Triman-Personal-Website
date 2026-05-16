"use client";

import { motion } from "framer-motion";
import { Search, ExternalLink, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Learning } from "@/lib/types";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";

const categories = [
  "All",
  "AI/ML",
  "Data Engineering",
  "Design",
  "Resources",
  "Others",
];

const categoryColors: Record<string, string> = {
  "AI/ML": "text-dusty-lavender bg-dusty-lavender/15",
  "Data Engineering": "text-muted-blue bg-muted-blue/15",
  Design: "text-soft-peach bg-soft-peach/20",
  Resources: "text-sage-green bg-sage-green/15",
  Others: "text-warm-mustard bg-warm-mustard/15",
};

export default function LearningsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [learnings, setLearnings] = useState<Learning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLearnings() {
      const { data, error } = await supabase
        .from("learnings")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setLearnings(data);
      setLoading(false);
    }
    fetchLearnings();
  }, []);

  const filteredLearnings = useMemo(() => {
    return learnings.filter((entry) => {
      const matchesCategory =
        selectedCategory === "All" || entry.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entry.tags || []).some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-extrabold text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
            What I&apos;m Learning 📓
          </h1>
          <p className="text-[var(--muted)]">
            a growing archive of things I&apos;m slowly figuring out
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search learnings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]/50 focus:shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="h-4 w-4 text-[var(--muted)] flex-shrink-0" />
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[var(--accent-light)]/30 text-[var(--accent)] border border-[var(--accent)]/40 shadow-sm"
                    : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/30"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Learnings */}
        <div className="space-y-4">
          {filteredLearnings.map((entry, i) => (
            <motion.article
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -2 }}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[var(--accent)]/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-xl font-semibold ${
                    categoryColors[entry.category] ||
                    "text-[var(--muted)] bg-[var(--card-border)]"
                  }`}
                >
                  {entry.category}
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {format(new Date(entry.created_at), "MMM d, yyyy")}
                </span>
              </div>

              <h2 className="font-bold text-lg text-[var(--foreground)] mb-2">
                {entry.title}
              </h2>

              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                {entry.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
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
                    className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-[var(--foreground)] font-medium transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Source
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16">
            <p className="text-[var(--muted)]">Loading...</p>
          </div>
        )}

        {!loading && filteredLearnings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--muted)] text-lg">
              No learnings found 🔍
            </p>
            <p className="text-sm text-[var(--muted)] mt-1">
              Try a different search or category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
