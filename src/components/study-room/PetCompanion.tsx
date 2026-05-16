"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStudyRoom } from "./StudyRoomContext";

type PetType = "cat" | "dog";

interface PetCompanionProps {
  type: PetType;
  className?: string;
}

// Lottie JSON URLs from LottieFiles
const LOTTIE_URLS = {
  cat: {
    active: "https://lottie.host/embed/e845b0f3-5765-4f4a-b8f3-0f2e3c5c5c5c/cat-active.json",
    sleeping: "https://lottie.host/embed/a1b2c3d4-5678-9abc-def0-123456789abc/cat-sleeping.json",
  },
  dog: {
    active: "https://lottie.host/embed/f1e2d3c4-b5a6-9788-7654-321098765432/dog-active.json",
    sleeping: "https://lottie.host/embed/9a8b7c6d-5e4f-3a2b-1c0d-fedcba987654/dog-sleeping.json",
  },
};

export default function PetCompanion({ type, className = "" }: PetCompanionProps) {
  const { isTimerRunning, isBreak } = useStudyRoom();
  const isActive = isTimerRunning && !isBreak;

  // Use SVG-based pets since Lottie URLs from LottieFiles require specific embed handling
  if (type === "cat") return <CatPet isActive={isActive} className={className} />;
  return <DogPet isActive={isActive} className={className} />;
}

function CatPet({ isActive, className }: { isActive: boolean; className: string }) {
  const isSleeping = !isActive;

  return (
    <motion.div
      className={`${className}`}
      animate={isSleeping ? { y: [0, 2, 0] } : { y: [0, -2, 0] }}
      transition={{ duration: isSleeping ? 3 : 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="70" height="60" viewBox="0 0 70 60">
        {/* Body */}
        <ellipse cx="35" cy="45" rx="18" ry="12" fill="#6a6060" />
        {/* Tail */}
        <motion.path
          stroke="#6a6060"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={
            isActive
              ? { d: ["M52 42 C56 38 58 34 56 28", "M52 42 C57 36 59 30 57 24", "M52 42 C56 38 58 34 56 28"] }
              : { d: "M52 45 C54 43 54 40 53 38" }
          }
          transition={{ duration: isActive ? 1.5 : 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Head */}
        <motion.g
          animate={isSleeping ? { y: 3, rotate: -5 } : { y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <circle cx="35" cy="28" r="13" fill="#7a7070" />
          {/* Ears */}
          <polygon points="25,18 21,6 29,14" fill="#7a7070" />
          <polygon points="45,18 49,6 41,14" fill="#7a7070" />
          <polygon points="25.5,17 22,8 28,14" fill="#d4908080" />
          <polygon points="44.5,17 48,8 42,14" fill="#d4908080" />
          {/* Eyes */}
          {isSleeping ? (
            <>
              <path d="M29 28 C30 27 33 27 34 28" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M36 28 C37 27 40 27 41 28" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="30" cy="27" r="2.5" fill="#1a1a1a" />
              <circle cx="40" cy="27" r="2.5" fill="#1a1a1a" />
              <circle cx="30.5" cy="26" r="0.8" fill="white" />
              <circle cx="40.5" cy="26" r="0.8" fill="white" />
            </>
          )}
          {/* Nose */}
          <ellipse cx="35" cy="31" rx="2" ry="1.3" fill="#d49080" />
          {/* Whiskers */}
          <line x1="22" y1="29" x2="28" y2="30" stroke="#9a9090" strokeWidth="0.5" />
          <line x1="22" y1="32" x2="28" y2="32" stroke="#9a9090" strokeWidth="0.5" />
          <line x1="48" y1="29" x2="42" y2="30" stroke="#9a9090" strokeWidth="0.5" />
          <line x1="48" y1="32" x2="42" y2="32" stroke="#9a9090" strokeWidth="0.5" />
          {/* Laptop for cat */}
          {isActive && (
            <g>
              <rect x="22" y="38" width="14" height="9" rx="1" fill="#2a2a3a" />
              <rect x="23" y="39" width="12" height="6" rx="0.5" fill="#3a4a6a" />
              <rect x="19" y="47" width="20" height="2" rx="1" fill="#3a3a4a" />
            </g>
          )}
        </motion.g>
        {/* Paws */}
        <ellipse cx="27" cy="54" rx="4" ry="2.5" fill="#5a5454" />
        <ellipse cx="43" cy="54" rx="4" ry="2.5" fill="#5a5454" />
        {/* Zzz for sleeping */}
        {isSleeping && (
          <motion.g
            animate={{ opacity: [0, 1, 0], y: [0, -5, -10] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <text x="48" y="18" fontSize="8" fill="#B7B4C7" opacity="0.6">z</text>
            <text x="52" y="13" fontSize="6" fill="#B7B4C7" opacity="0.4">z</text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}

function DogPet({ isActive, className }: { isActive: boolean; className: string }) {
  const isSleeping = !isActive;

  return (
    <motion.div
      className={`${className}`}
      animate={isActive ? { y: [0, -3, 0] } : { y: [0, 1, 0] }}
      transition={{ duration: isActive ? 0.8 : 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="70" height="60" viewBox="0 0 70 60">
        {/* Body */}
        <ellipse cx="35" cy="44" rx="18" ry="12" fill="#d4a070" />
        {/* Tail */}
        <motion.path
          stroke="#d4a070"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={
            isActive
              ? { d: ["M52 40 C56 36 58 30 56 24", "M52 40 C57 34 59 26 57 20", "M52 40 C56 36 58 30 56 24"] }
              : { d: "M52 44 C54 42 54 40 53 38" }
          }
          transition={{ duration: isActive ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Head */}
        <motion.g
          animate={isSleeping ? { y: 3, rotate: 4 } : { y: 0, rotate: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <circle cx="35" cy="27" r="13" fill="#e0b080" />
          {/* Floppy ears */}
          <ellipse cx="23" cy="24" rx="5" ry="9" fill="#b07050" transform="rotate(-10 23 24)" />
          <ellipse cx="47" cy="24" rx="5" ry="9" fill="#b07050" transform="rotate(10 47 24)" />
          {/* Eyes */}
          {isSleeping ? (
            <>
              <path d="M29 26 C30 25 33 25 34 26" stroke="#2a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M36 26 C37 25 40 25 41 26" stroke="#2a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="30" cy="25" r="3" fill="#2a1a1a" />
              <circle cx="40" cy="25" r="3" fill="#2a1a1a" />
              <circle cx="30.5" cy="24" r="1" fill="white" />
              <circle cx="40.5" cy="24" r="1" fill="white" />
            </>
          )}
          {/* Nose */}
          <ellipse cx="35" cy="30" rx="3" ry="2" fill="#2a1a1a" />
          {/* Tongue when active */}
          {isActive && (
            <motion.ellipse
              cx="35" cy="34" rx="2" ry="2.5" fill="#e07070"
              animate={{ scaleY: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </motion.g>
        {/* Paws */}
        <ellipse cx="27" cy="54" rx="4.5" ry="2.5" fill="#c09060" />
        <ellipse cx="43" cy="54" rx="4.5" ry="2.5" fill="#c09060" />
        {/* Zzz for sleeping */}
        {isSleeping && (
          <motion.g
            animate={{ opacity: [0, 1, 0], y: [0, -5, -10] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <text x="48" y="16" fontSize="8" fill="#B7B4C7" opacity="0.6">z</text>
            <text x="52" y="11" fontSize="6" fill="#B7B4C7" opacity="0.4">z</text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
