"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

interface AvatarProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  animate?: boolean;
  className?: string;
}

const sizes = {
  sm: 36,
  md: 48,
  lg: 80,
  xl: 140,
  "2xl": 170,
};

export default function Avatar({ size = "md", animate = true, className = "" }: AvatarProps) {
  const s = sizes[size];
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Use light version for SSR, switch after mount
  const src = mounted && isDark ? "/logo%20dark.png" : "/logo%20png.png";

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      whileHover={animate ? { scale: 1.05, rotate: 2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Image
        src={src}
        alt="Triman's avatar"
        width={s}
        height={s}
        className="rounded-full object-cover"
        priority={size === "xl" || size === "2xl"}
      />
    </motion.div>
  );
}
