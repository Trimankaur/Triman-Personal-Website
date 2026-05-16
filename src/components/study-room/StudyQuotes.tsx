"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const studyQuotes = [
  "Small steps every day make big changes.",
  "The expert in anything was once a beginner.",
  "Focus on the process, not the outcome.",
  "Learning is not a sprint. It's a lifetime walk.",
  "Be patient with yourself. Growth takes time.",
  "Curiosity is the engine of achievement.",
  "One page at a time. One concept at a time.",
  "The quiet hours are where the magic happens.",
  "You're doing better than you think.",
  "You don't need to rush. Just keep learning.",
  "You can.",
  "Don't stop until you're proud.",
];

export default function StudyQuotes() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % studyQuotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-start gap-1">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.6 }}
          className="text-[12px] sm:text-[13px] font-medium leading-relaxed text-[#F3EBDD]/90"
        >
          {studyQuotes[currentIndex]}
        </motion.p>
      </AnimatePresence>
      <span className="text-[16px] mt-1">🌱</span>
    </div>
  );
}
