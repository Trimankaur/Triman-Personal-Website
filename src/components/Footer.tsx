"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] py-8 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-sm text-[var(--muted)]">
          <p className="flex items-center gap-1.5 font-medium">
            Built with <Heart className="h-3.5 w-3.5 text-dusty-pink fill-dusty-pink" /> and curiosity
          </p>
          <p className="text-xs opacity-70">
            a cozy corner of the internet for learning in public ☕
          </p>
        </div>
      </div>
    </footer>
  );
}
