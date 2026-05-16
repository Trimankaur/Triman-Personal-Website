"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Curiosity } from "@/lib/types";
import { useState, useEffect } from "react";

export default function CuriositiesSection() {
  const [curiosities, setCuriosities] = useState<Curiosity[]>([]);

  useEffect(() => {
    async function fetchCuriosities() {
      const { data, error } = await supabase
        .from("curiosities")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setCuriosities(data);
    }
    fetchCuriosities();
  }, []);

  if (curiosities.length === 0) return null;

  return (
    <section className="py-16 px-4">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h2 className="font-bold text-2xl text-[var(--foreground)] mb-2">
              Currently Curious About
            </h2>
            <p className="text-sm text-[var(--muted)]">
              questions I&apos;m sitting with right now 🌱
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {curiosities.map((curiosity, i) => (
              <motion.div
                key={curiosity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative bg-[var(--card)] border border-[var(--card-border)] rounded-2xl px-5 py-3 shadow-sm hover:shadow-md hover:border-[var(--accent)]/30 transition-all cursor-default"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]/60 group-hover:text-[var(--accent)] transition-colors" />
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {curiosity.topic}
                  </span>
                </div>

                {curiosity.description && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[var(--card)] border border-[var(--card-border)] rounded-xl shadow-lg text-xs text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-[220px] text-center">
                    {curiosity.description}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
