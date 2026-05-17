"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, Filter, ChevronDown, X } from "lucide-react";
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
  const [expandedEntry, setExpandedEntry] = useState<Learning | null>(null);
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());

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
  }, [selectedCategory, searchQuery, learnings]);

  // Group by month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, Learning[]> = {};
    for (const entry of filteredLearnings) {
      const monthKey = format(new Date(entry.created_at), "MMMM yyyy");
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(entry);
    }
    return groups;
  }, [filteredLearnings]);

  const toggleMonth = (month: string) => {
    setCollapsedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  };

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

        {/* Learnings grouped by month */}
        <div className="space-y-8">
          {Object.entries(groupedByMonth).map(([month, entries]) => {
            const isCollapsed = collapsedMonths.has(month);
            return (
              <div key={month}>
                {/* Month header */}
                <button
                  onClick={() => toggleMonth(month)}
                  className="flex items-center gap-2 mb-4 group"
                >
                  <motion.div
                    animate={{ rotate: isCollapsed ? -90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
                  </motion.div>
                  <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wide">
                    {month}
                  </h2>
                  <span className="text-xs text-[var(--muted)] ml-1">
                    ({entries.length})
                  </span>
                </button>

                {/* Cards grid */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {entries.map((entry, i) => (
                        <motion.article
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.3 }}
                          whileHover={{ y: -2 }}
                          className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[var(--accent)]/20 transition-all h-[180px] flex flex-col cursor-pointer"
                          onClick={() => setExpandedEntry(entry)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold ${
                                categoryColors[entry.category] ||
                                "text-[var(--muted)] bg-[var(--card-border)]"
                              }`}
                            >
                              {entry.category}
                            </span>
                            <span className="text-[10px] text-[var(--muted)]">
                              {format(new Date(entry.created_at), "MMM d")}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-[var(--foreground)] mb-1.5 line-clamp-1">
                            {entry.title}
                          </h3>

                          <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-3 flex-1">
                            {entry.content}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--card-border)]/50">
                            <div className="flex gap-1 overflow-hidden">
                              {entry.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] text-[var(--muted)] bg-[var(--card-border)]/60 px-1.5 py-0.5 rounded-md"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {entry.tags.length > 2 && (
                                <span className="text-[10px] text-[var(--muted)]">
                                  +{entry.tags.length - 2}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[var(--accent)] font-medium">
                              Read more →
                            </span>
                          </div>
                        </motion.article>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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

      {/* === EXPANDED MODAL / FOCUS VIEW === */}
      <AnimatePresence>
        {expandedEntry && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedEntry(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-8 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setExpandedEntry(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-border)]/30 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Category + Date */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-xs px-2.5 py-1 rounded-xl font-semibold ${
                    categoryColors[expandedEntry.category] ||
                    "text-[var(--muted)] bg-[var(--card-border)]"
                  }`}
                >
                  {expandedEntry.category}
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {format(new Date(expandedEntry.created_at), "MMMM d, yyyy")}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-bold text-2xl text-[var(--foreground)] mb-4">
                {expandedEntry.title}
              </h2>

              {/* Content */}
              <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-wrap mb-6">
                {expandedEntry.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {expandedEntry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--muted)] bg-[var(--card-border)]/60 px-2.5 py-1 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Source link */}
              {expandedEntry.link && (
                <a
                  href={expandedEntry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-[var(--foreground)] font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Source
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
