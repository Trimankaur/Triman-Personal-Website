"use client";

import { motion } from "framer-motion";
import { GitFork, ExternalLink, Layers } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Project } from "@/lib/types";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);
  return (
    <div className="py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-extrabold text-3xl sm:text-4xl text-[var(--foreground)] mb-3">
            Late Night Experiments 🛠️
          </h1>
          <p className="text-[var(--muted)]">
            things I&apos;ve built while learning, exploring, and figuring stuff out
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-16">
            <p className="text-[var(--muted)]">Loading...</p>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--muted)] text-lg">No projects yet</p>
            <p className="text-sm text-[var(--muted)] mt-1">Add some from the admin dashboard</p>
          </div>
        )}

        <div className="space-y-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -2 }}
              className="bg-[var(--card)] border border-[var(--card-border)] rounded-3xl p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-bold text-xl text-[var(--foreground)]">
                  {project.title}
                </h2>
                <span className="text-xs text-[var(--muted)] font-medium">
                  {format(new Date(project.created_at), "MMM yyyy")}
                </span>
              </div>

              <p className="text-[var(--muted)] leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex items-center gap-2 mb-6">
                <Layers className="h-4 w-4 text-[var(--muted)]" />
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-xl bg-[var(--accent-light)]/20 text-[var(--accent)] font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.lessons && (
                <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-2xl p-4 mb-6">
                  <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-2 font-semibold">
                    💡 What I learned
                  </p>
                  <p className="text-sm text-[var(--foreground)] italic">
                    {project.lessons}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4">
                {project.github_link && (
                  <a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent)] font-medium transition-colors"
                  >
                    <GitFork className="h-4 w-4" />
                    Source
                  </a>
                )}
                {project.live_link && (
                  <a
                    href={project.live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent)] font-medium transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
