"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Quote,
  FolderOpen,
  LogOut,
  Plus,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tab = "learnings" | "quotes" | "projects";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("learnings");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      setAuthError("An error occurred during login.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--muted)]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-8 shadow-sm">
            <h1 className="font-serif text-2xl text-[var(--foreground)] text-center mb-2">
              Admin Login
            </h1>
            <p className="text-sm text-[var(--muted)] text-center mb-6">
              Welcome back, Triman
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
                  required
                />
              </div>

              {authError && (
                <p className="text-xs text-red-400">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[var(--accent-light)]/30 text-[var(--accent)] border border-[var(--accent)]/40 text-sm font-semibold hover:bg-[var(--accent-light)]/50 transition-colors"
              >
                Sign In
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl text-[var(--foreground)]">
              Dashboard
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Quick add, manage, and keep going.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-[var(--card-border)]">
          {[
            { id: "learnings" as Tab, label: "Learnings", icon: BookOpen },
            { id: "quotes" as Tab, label: "Quotes", icon: Quote },
            { id: "projects" as Tab, label: "Projects", icon: FolderOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-dusty-purple text-dusty-purple"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "learnings" && <LearningsAdmin />}
        {activeTab === "quotes" && <QuotesAdmin />}
        {activeTab === "projects" && <ProjectsAdmin />}
      </div>
    </div>
  );
}

function LearningsAdmin() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("AI/ML");
  const [tags, setTags] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const { error } = await supabase.from("learnings").insert({
        title,
        content,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        link: link || null,
      });

      if (error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus("Saved!");
        setTitle("");
        setContent("");
        setTags("");
        setLink("");
        setTimeout(() => setStatus(""), 2000);
      }
    } catch {
      setStatus("Error saving entry.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6"
    >
      <h2 className="font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Quick Add Learning
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
            placeholder="What did you learn today?"
            required
          />
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">
            Content / Reflection
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50 resize-none"
            placeholder="Write your thoughts..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
            >
              <option>AI/ML</option>
              <option>Data Engineering</option>
              <option>Design</option>
              <option>Resources</option>
              <option>Others</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
              placeholder="RAG, LLM, python"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">
            Link (optional)
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
            placeholder="https://..."
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[var(--accent-light)]/30 text-[var(--accent)] border border-[var(--accent)]/40 text-sm font-semibold hover:bg-[var(--accent-light)]/50 transition-colors"
          >
            Publish
          </button>
          {status && (
            <span className="text-sm text-[var(--muted)]">{status}</span>
          )}
        </div>
      </form>
    </motion.div>
  );
}

function QuotesAdmin() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const { error } = await supabase.from("quotes").insert({
        quote,
        author,
        category: category || null,
        personal_note: personalNote || null,
      });

      if (error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus("Saved!");
        setQuote("");
        setAuthor("");
        setCategory("");
        setPersonalNote("");
        setTimeout(() => setStatus(""), 2000);
      }
    } catch {
      setStatus("Error saving quote.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6"
    >
      <h2 className="font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Quote
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">Quote</label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50 resize-none"
            placeholder="The words that stay with you..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
              placeholder="Who said it?"
              required
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">
              Category (optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
              placeholder="Growth, Learning, etc."
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">
            Personal Note (optional)
          </label>
          <input
            type="text"
            value={personalNote}
            onChange={(e) => setPersonalNote(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
            placeholder="Why does this resonate with you?"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[var(--accent-light)]/30 text-[var(--accent)] border border-[var(--accent)]/40 text-sm font-semibold hover:bg-[var(--accent-light)]/50 transition-colors"
          >
            Save Quote
          </button>
          {status && (
            <span className="text-sm text-[var(--muted)]">{status}</span>
          )}
        </div>
      </form>
    </motion.div>
  );
}

function ProjectsAdmin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stack, setStack] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [lessons, setLessons] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const { error } = await supabase.from("projects").insert({
        title,
        description,
        stack: stack.split(",").map((s) => s.trim()).filter(Boolean),
        github_link: githubLink || null,
        live_link: liveLink || null,
        lessons: lessons || null,
      });

      if (error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus("Saved!");
        setTitle("");
        setDescription("");
        setStack("");
        setGithubLink("");
        setLiveLink("");
        setLessons("");
        setTimeout(() => setStatus(""), 2000);
      }
    } catch {
      setStatus("Error saving project.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6"
    >
      <h2 className="font-medium text-[var(--foreground)] mb-4 flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
            placeholder="Project name"
            required
          />
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50 resize-none"
            placeholder="What problem does this solve? What was your thinking process?"
            required
          />
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">
            Tech Stack (comma separated)
          </label>
          <input
            type="text"
            value={stack}
            onChange={(e) => setStack(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
            placeholder="Next.js, Python, Supabase"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">
              GitHub Link
            </label>
            <input
              type="url"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">
              Live Link
            </label>
            <input
              type="url"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">
            Lessons Learned
          </label>
          <textarea
            value={lessons}
            onChange={(e) => setLessons(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] focus:outline-none focus:border-dusty-purple/50 resize-none"
            placeholder="What did you learn from building this?"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[var(--accent-light)]/30 text-[var(--accent)] border border-[var(--accent)]/40 text-sm font-semibold hover:bg-[var(--accent-light)]/50 transition-colors"
          >
            Save Project
          </button>
          {status && (
            <span className="text-sm text-[var(--muted)]">{status}</span>
          )}
        </div>
      </form>
    </motion.div>
  );
}
