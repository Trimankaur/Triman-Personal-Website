"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Play, Pause, RotateCcw, SkipForward, Volume2, Cat, Dog } from "lucide-react";
import Link from "next/link";

type TimerMode = "25min" | "50min" | "custom";
type PetType = "cat" | "dog";

interface AmbienceOption {
  id: string;
  label: string;
  icon: string;
  url: string;
}

const AMBIENCE: AmbienceOption[] = [
  { id: "lofi", label: "Lofi", icon: "🎵", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
  { id: "fireplace", label: "Fireplace", icon: "🔥", url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3" },
  { id: "forest", label: "Forest", icon: "🌲", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf5bf94.mp3" },
  { id: "ocean", label: "Ocean", icon: "🌊", url: "https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3" },
];

const QUOTES = [
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
];

const WELLNESS_REMINDERS = [
  { message: "Stretch a little ✨", triggerMinutes: 25 },
  { message: "Hydrate yourself 💧", triggerMinutes: 40 },
  { message: "Relax your eyes 👀", triggerMinutes: 20 },
  { message: "Fix your posture 🌱", triggerMinutes: 35 },
  { message: "Take a deep breath 🌬️", triggerMinutes: 15 },
  { message: "You're doing great 🌟", triggerMinutes: 30 },
];

// Dog prompts by timing
const DOG_START_PROMPTS = [
  "Let's focus together 🐶",
  "You got this ✨",
  "Deep work mode activated 💻",
  "I'll guard the study session 🐶",
  "Proud of you for starting 💛",
];

const DOG_WELLNESS_PROMPTS = [
  "Stay with it, human 🐾",
  "One session at a time 🌙",
  "Small progress is still progress",
  "Focus first, scroll later 👀",
];

const DOG_END_PROMPTS = [
  "Almost break time!",
  "You're doing amazing 🌟",
  "Finish strong 💪",
];

const DOG_BREAK_PROMPTS = [
  "Good job! Rest now 🐶",
  "You earned this break 🎉",
  "Stretch those legs! 🐾",
];

// Cat prompts by timing
const CAT_START_PROMPTS = [
  "Quiet focus is nice.",
  "Hmm… acceptable productivity",
  "You're typing very intensely today",
  "Fine. I'll supervise.",
  "Let's see how long you last.",
];

const CAT_WELLNESS_PROMPTS = [
  "Don't forget to blink 👀",
  "Humans need water too 💧",
  "Stretch before you become a chair",
  "Your posture concerns me.",
  "Take a deep breath 🌱",
];

const CAT_END_PROMPTS = [
  "Almost done. Impressive.",
  "Rest your eyes for a moment",
  "You survived. Barely.",
];

const CAT_BREAK_PROMPTS = [
  "You've earned a cozy break ☕",
  "Nap time. For both of us.",
  "Finally, some peace.",
];

function pickRandom(arr: string[], usedSet: Set<string>): string {
  const available = arr.filter((m) => !usedSet.has(m));
  const pool = available.length > 0 ? available : arr;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  usedSet.add(pick);
  if (usedSet.size >= arr.length) {
    usedSet.clear();
  }
  return pick;
}

export default function StudyRoomScene() {
  // Timer state
  const [mode, setMode] = useState<TimerMode>("25min");
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [customFocus, setCustomFocus] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedRef = useRef(0);

  // Audio state
  const [activeAmbience, setActiveAmbience] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Quote state
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Pet state
  const [pet, setPet] = useState<PetType>("cat");
  const [reminder, setReminder] = useState<string | null>(null);
  const [petReacting, setPetReacting] = useState(false);
  const [showTodo, setShowTodo] = useState(true);
  const [streak, setStreak] = useState(0);
  const usedPromptsRef = useRef(new Set<string>());
  const streakIncrementedRef = useRef(false);

  const getWorkTime = useCallback(() => {
    switch (mode) {
      case "25min": return 25 * 60;
      case "50min": return 50 * 60;
      case "custom": return customFocus * 60;
    }
  }, [mode, customFocus]);

  const getBreakTime = useCallback(() => {
    switch (mode) {
      case "25min": return 5 * 60;
      case "50min": return 10 * 60;
      case "custom": return customBreak * 60;
    }
  }, [mode, customBreak]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Session start prompt - always "Let's focus together"
  useEffect(() => {
    if (isRunning && !isBreak) {
      streakIncrementedRef.current = false;
      const msg = pet === "dog" ? "Let's focus together 🐶" : "Let's focus together 🐱";
      setReminder(msg);
      setPetReacting(true);
      const timeout = setTimeout(() => {
        setReminder(null);
        setPetReacting(false);
      }, 4000);
      return () => {
        clearTimeout(timeout);
        setReminder(null);
        setPetReacting(false);
      };
    } else if (!isRunning && !isBreak) {
      setReminder(null);
      setPetReacting(false);
    }
  }, [isRunning, isBreak, pet]);

  // Break start prompt
  useEffect(() => {
    if (isBreak) {
      const prompts = pet === "dog" ? DOG_BREAK_PROMPTS : CAT_BREAK_PROMPTS;
      const msg = pickRandom(prompts, usedPromptsRef.current);
      setReminder(msg);
      setPetReacting(true);
      const timeout = setTimeout(() => {
        setReminder(null);
        setPetReacting(false);
      }, 5000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isBreak, pet]);

  // Mid-session wellness + near-end encouragement
  useEffect(() => {
    if (!isRunning || isBreak) {
      elapsedRef.current = 0;
      return;
    }

    const totalWork = getWorkTime();
    const totalMinutes = totalWork / 60;

    const reminderInterval = setInterval(() => {
      elapsedRef.current += 1;
      const elapsed = elapsedRef.current;
      const remaining = totalMinutes - elapsed;

      // Near end (2-3 min left)
      if (remaining <= 3 && remaining >= 2) {
        const prompts = pet === "dog" ? DOG_END_PROMPTS : CAT_END_PROMPTS;
        const msg = pickRandom(prompts, usedPromptsRef.current);
        setReminder(msg);
        setPetReacting(true);
        setTimeout(() => { setReminder(null); setPetReacting(false); }, 5000);
        return;
      }

      // Wellness prompts every 10 minutes
      if (elapsed > 0 && elapsed % 10 === 0 && remaining > 3) {
        const prompts = pet === "dog" ? DOG_WELLNESS_PROMPTS : CAT_WELLNESS_PROMPTS;
        const msg = pickRandom(prompts, usedPromptsRef.current);
        setReminder(msg);
        setPetReacting(true);
        setTimeout(() => { setReminder(null); setPetReacting(false); }, 5000);
      }
    }, 60000);

    return () => clearInterval(reminderInterval);
  }, [isRunning, isBreak, pet, getWorkTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            if (!isBreak) {
              setIsBreak(true);
              if (!streakIncrementedRef.current) {
                streakIncrementedRef.current = true;
                setStreak((s) => s + 1);
              }
              return getBreakTime();
            } else {
              setIsBreak(false);
              setIsRunning(false);
              streakIncrementedRef.current = false;
              return getWorkTime();
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isBreak, getWorkTime, getBreakTime]);

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setIsBreak(false);
    switch (newMode) {
      case "25min": setTimeLeft(25 * 60); break;
      case "50min": setTimeLeft(50 * 60); break;
      case "custom": setTimeLeft(customFocus * 60); break;
    }
  };

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(getWorkTime());
  };

  const skipBreak = () => {
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(getWorkTime());
    }
  };

  // Audio controls
  const playAmbience = async (id: string) => {
    if (activeAmbience === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      setActiveAmbience(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const sound = AMBIENCE.find((a) => a.id === id);
    if (!sound) return;

    const audio = new Audio(sound.url);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    try {
      await audio.play();
      setActiveAmbience(id);
    } catch {
      // autoplay blocked
    }
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* === BACKGROUND IMAGE === */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/study-room-bg.png"
        alt="Cozy study room"
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(0, 0, 0, 0.35)" }} />

      {/* === HOME BUTTON - top left === */}
      <div className="absolute top-5 left-5 z-30">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[12px] text-[#ccc] hover:text-white transition-colors bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* === FLOATING CONTROL PANEL - right side === */}
      <motion.div
        className="absolute top-[50%] -translate-y-[50%] right-6 sm:right-10 z-20 w-[320px] sm:w-[360px]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          className="rounded-[24px] p-6 sm:p-7 flex flex-col gap-6"
          style={{
            background: "rgba(18, 18, 32, 0.65)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          {/* --- Pomodoro Modes --- */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#B7B4C7]/60 mb-3 font-medium">
              Focus Mode
            </p>
            <div className="flex gap-2">
              {([
                { id: "25min", label: "Focus Mode" },
                { id: "50min", label: "Deep Work" },
                { id: "custom", label: "Custom" },
              ] as const).map((m) => (
                <motion.button
                  key={m.id}
                  onClick={() => changeMode(m.id)}
                  className={`px-3 py-2 rounded-xl text-[11px] font-medium transition-all flex-1 ${
                    mode === m.id
                      ? "text-[#F6B56B] border-[#F6B56B]/30"
                      : "text-[#B7B4C7]/70 border-transparent hover:text-[#B7B4C7]"
                  }`}
                  style={{
                    background: mode === m.id ? "rgba(246,181,107,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${mode === m.id ? "rgba(246,181,107,0.25)" : "rgba(255,255,255,0.05)"}`,
                    boxShadow: mode === m.id ? "0 0 20px rgba(246,181,107,0.08)" : "none",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {m.label}
                </motion.button>
              ))}
            </div>

            {/* Custom inputs */}
            <AnimatePresence>
              {mode === "custom" && (
                <motion.div
                  className="flex gap-3 mt-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex-1">
                    <label className="text-[9px] text-[#B7B4C7]/50 mb-1 block">Focus (min)</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={customFocus}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setCustomFocus(v);
                        if (!isRunning) setTimeLeft(v * 60);
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[12px] text-[#F3EBDD] outline-none focus:border-[#F6B56B]/30"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-[#B7B4C7]/50 mb-1 block">Break (min)</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={customBreak}
                      onChange={(e) => setCustomBreak(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[12px] text-[#F3EBDD] outline-none focus:border-[#F6B56B]/30"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- Ambient Music --- */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#B7B4C7]/60 mb-3 font-medium">
              Ambience
            </p>
            <div className="flex gap-2 mb-3">
              {AMBIENCE.map((sound) => (
                <motion.button
                  key={sound.id}
                  onClick={() => playAmbience(sound.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl flex-1 transition-all ${
                    activeAmbience === sound.id
                      ? "text-[#F6B56B]"
                      : "text-[#B7B4C7]/70 hover:text-[#B7B4C7]"
                  }`}
                  style={{
                    background: activeAmbience === sound.id ? "rgba(246,181,107,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${activeAmbience === sound.id ? "rgba(246,181,107,0.2)" : "rgba(255,255,255,0.05)"}`,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-[18px]">{sound.icon}</span>
                  <span className="text-[9px] font-medium">{sound.label}</span>
                  {activeAmbience === sound.id && (
                    <motion.div
                      className="flex items-end gap-[2px] h-[8px] mt-0.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div className="w-[2px] rounded-full bg-[#F6B56B]" animate={{ height: ["2px", "8px", "2px"] }} transition={{ duration: 0.6, repeat: Infinity }} />
                      <motion.div className="w-[2px] rounded-full bg-[#F6B56B]" animate={{ height: ["6px", "2px", "6px"] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
                      <motion.div className="w-[2px] rounded-full bg-[#F6B56B]" animate={{ height: ["3px", "7px", "3px"] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Single volume slider */}
            <div className="flex items-center gap-3">
              <Volume2 className="h-3.5 w-3.5 text-[#B7B4C7]/50" />
              <div className="relative flex-1 h-[4px] bg-white/8 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-[#F6B56B]/70 transition-all"
                  style={{ width: `${volume * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-[9px] text-[#B7B4C7]/40 w-[28px] text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* --- Main Timer Display --- */}
          <div className="flex flex-col items-center py-4">
            <motion.div
              className="relative"
              animate={isRunning ? { scale: [1, 1.01, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span
                className="text-[56px] sm:text-[64px] font-light tracking-wider font-mono"
                style={{
                  color: "#F3EBDD",
                  textShadow: isRunning
                    ? "0 0 30px rgba(246,181,107,0.3), 0 0 60px rgba(246,181,107,0.1)"
                    : "0 0 20px rgba(243,235,221,0.1)",
                }}
              >
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </motion.div>
            <span className="text-[11px] text-[#B7B4C7]/60 mt-1 font-medium">
              {isBreak ? "Break Time" : isRunning ? "Focusing..." : "Ready to focus"}
            </span>
          </div>

          {/* --- Playback Controls --- */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-4">
              {/* Reset */}
              <motion.button
                onClick={reset}
                className="p-3 rounded-full bg-white/5 text-[#B7B4C7]/60 hover:text-[#F3EBDD] hover:bg-white/10 transition-all border border-white/5"
                whileTap={{ scale: 0.9 }}
              >
                <RotateCcw className="h-4 w-4" />
              </motion.button>

              {/* Play/Pause */}
              <motion.button
                onClick={() => setIsRunning(!isRunning)}
                className="p-5 rounded-full transition-all"
                style={{
                  background: isRunning
                    ? "rgba(246,181,107,0.15)"
                    : "rgba(246,181,107,0.1)",
                  border: "1px solid rgba(246,181,107,0.3)",
                  boxShadow: isRunning
                    ? "0 0 30px rgba(246,181,107,0.15), inset 0 0 20px rgba(246,181,107,0.05)"
                    : "0 0 20px rgba(246,181,107,0.08)",
                }}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
              >
                {isRunning ? (
                  <Pause className="h-5 w-5 text-[#F6B56B]" />
                ) : (
                  <Play className="h-5 w-5 text-[#F6B56B] ml-[2px]" />
                )}
              </motion.button>

              {/* Skip break - always visible, enabled only during break */}
              <motion.button
                onClick={skipBreak}
                className={`p-3 rounded-full bg-white/5 transition-all border border-white/5 ${
                  isBreak
                    ? "text-[#B7B4C7] hover:text-[#F3EBDD] hover:bg-white/10"
                    : "text-[#B7B4C7]/20 cursor-not-allowed"
                }`}
                whileTap={isBreak ? { scale: 0.9 } : {}}
              >
                <SkipForward className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Skip break hint */}
            {isBreak && (
              <motion.p
                className="text-[10px] text-[#B7B4C7]/50 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Press skip to end break early
              </motion.p>
            )}
          </div>

          {/* --- Streak counter --- */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: Math.min(streak, 8) }).map((_, i) => (
                <motion.span
                  key={i}
                  className="text-[14px]"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                >
                  ⭐
                </motion.span>
              ))}
              {streak > 8 && (
                <span className="text-[10px] text-[#F6B56B] font-medium ml-1">
                  +{streak - 8}
                </span>
              )}
            </div>
            {streak > 0 && (
              <span className="text-[10px] text-[#B7B4C7]/50 ml-auto">
                {streak} session{streak > 1 ? "s" : ""} ☑️
              </span>
            )}
            {streak === 0 && (
              <span className="text-[10px] text-[#B7B4C7]/40 italic">
                Complete a session to earn stars
              </span>
            )}
          </div>

          {/* --- Bottom row: Pet + Todo toggle --- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setPet("cat")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  pet === "cat" ? "text-[#F6B56B]" : "text-[#B7B4C7]/70 hover:text-[#B7B4C7]"
                }`}
                style={{
                  background: pet === "cat" ? "rgba(246,181,107,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${pet === "cat" ? "rgba(246,181,107,0.2)" : "rgba(255,255,255,0.05)"}`,
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Cat className="h-3.5 w-3.5" />
              </motion.button>
              <motion.button
                onClick={() => setPet("dog")}
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  pet === "dog" ? "text-[#F6B56B]" : "text-[#B7B4C7]/70 hover:text-[#B7B4C7]"
                }`}
                style={{
                  background: pet === "dog" ? "rgba(246,181,107,0.1)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${pet === "dog" ? "rgba(246,181,107,0.2)" : "rgba(255,255,255,0.05)"}`,
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Dog className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            {/* Todo toggle - bottom right */}
            <motion.button
              onClick={() => setShowTodo(!showTodo)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                showTodo ? "text-[#F6B56B]" : "text-[#B7B4C7]/70 hover:text-[#B7B4C7]"
              }`}
              style={{
                background: showTodo ? "rgba(246,181,107,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${showTodo ? "rgba(246,181,107,0.2)" : "rgba(255,255,255,0.05)"}`,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span>To Do</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* === PET COMPANION - bottom left === */}
      <motion.div
        className="absolute bottom-5 left-6 sm:left-10 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {/* Speech bubble reminder */}
        <AnimatePresence>
          {reminder && (
            <motion.div
              className="absolute -top-12 left-4 whitespace-nowrap"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div
                className="px-3 py-1.5 rounded-xl text-[11px] font-medium text-[#F3EBDD]"
                style={{
                  background: "rgba(18, 18, 32, 0.75)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(246,181,107,0.2)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                {reminder}
              </div>
              {/* Bubble tail */}
              <div
                className="absolute -bottom-1 left-6 w-2.5 h-2.5 rotate-45"
                style={{
                  background: "rgba(18, 18, 32, 0.75)",
                  borderRight: "1px solid rgba(246,181,107,0.2)",
                  borderBottom: "1px solid rgba(246,181,107,0.2)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pet SVG */}
        {pet === "cat" ? (
          <CatPet isActive={isRunning && !isBreak} reacting={petReacting} />
        ) : (
          <DogPet isActive={isRunning && !isBreak} reacting={petReacting} />
        )}
      </motion.div>

      {/* === DRAGGABLE STICKY NOTE TODO === */}
      {showTodo && <StickyNoteTodo />}

      {/* === QUOTE - bottom center, white text === */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 z-20 flex justify-center px-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="text-[13px] sm:text-[14px] text-white font-medium italic text-center"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            &ldquo;{QUOTES[quoteIndex]}&rdquo;
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}


// === Pet Components ===

function CatPet({ isActive, reacting }: { isActive: boolean; reacting: boolean }) {
  return (
    <motion.div
      animate={
        reacting
          ? { y: [0, -4, 0], rotate: [0, -2, 2, 0] }
          : isActive
          ? { y: [0, -1, 0] }
          : { y: [0, 1, 0] }
      }
      transition={{
        duration: reacting ? 0.5 : isActive ? 1.5 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width="120" height="106" viewBox="0 0 80 70">
        {/* Body */}
        <ellipse cx="40" cy="52" rx="20" ry="14" fill="#6a6060" />
        {/* Tail */}
        <motion.path
          stroke="#6a6060"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={
            isActive
              ? { d: ["M58 48 C62 44 64 38 62 32", "M58 48 C63 42 65 34 63 28", "M58 48 C62 44 64 38 62 32"] }
              : { d: "M58 52 C60 50 60 47 59 44" }
          }
          transition={{ duration: isActive ? 1.5 : 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Head */}
        <motion.g
          animate={
            reacting
              ? { rotate: [0, 5, -5, 0] }
              : !isActive
              ? { y: 2, rotate: -3 }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration: reacting ? 0.4 : 1, ease: "easeInOut" }}
        >
          <circle cx="40" cy="32" r="14" fill="#7a7070" />
          {/* Ears */}
          <polygon points="29,22 24,8 34,18" fill="#7a7070" />
          <polygon points="51,22 56,8 46,18" fill="#7a7070" />
          {/* Inner ears */}
          <polygon points="29.5,21 25.5,10 33,18" fill="rgba(212,144,128,0.5)" />
          <polygon points="50.5,21 54.5,10 47,18" fill="rgba(212,144,128,0.5)" />
          {/* Eyes */}
          {!isActive ? (
            <>
              <path d="M34 32 C35 31 38 31 39 32" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M41 32 C42 31 45 31 46 32" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="35" cy="31" r="2.5" fill="#1a1a1a" />
              <circle cx="45" cy="31" r="2.5" fill="#1a1a1a" />
              <circle cx="35.5" cy="30" r="0.8" fill="white" />
              <circle cx="45.5" cy="30" r="0.8" fill="white" />
            </>
          )}
          {/* Nose */}
          <ellipse cx="40" cy="35" rx="2" ry="1.3" fill="#d49080" />
          {/* Whiskers */}
          <line x1="26" y1="33" x2="33" y2="34" stroke="#9a9090" strokeWidth="0.5" />
          <line x1="26" y1="36" x2="33" y2="36" stroke="#9a9090" strokeWidth="0.5" />
          <line x1="54" y1="33" x2="47" y2="34" stroke="#9a9090" strokeWidth="0.5" />
          <line x1="54" y1="36" x2="47" y2="36" stroke="#9a9090" strokeWidth="0.5" />
        </motion.g>
        {/* Paws */}
        <ellipse cx="32" cy="63" rx="4.5" ry="2.5" fill="#5a5454" />
        <ellipse cx="48" cy="63" rx="4.5" ry="2.5" fill="#5a5454" />
        {/* Zzz when idle */}
        {!isActive && (
          <motion.g
            animate={{ opacity: [0, 1, 0], y: [0, -6, -12] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <text x="55" y="20" fontSize="9" fill="white" opacity="0.5">z</text>
            <text x="60" y="14" fontSize="7" fill="white" opacity="0.35">z</text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}

function DogPet({ isActive, reacting }: { isActive: boolean; reacting: boolean }) {
  return (
    <motion.div
      animate={
        reacting
          ? { y: [0, -5, 0], scale: [1, 1.05, 1] }
          : isActive
          ? { y: [0, -2, 0] }
          : { y: [0, 1, 0] }
      }
      transition={{
        duration: reacting ? 0.4 : isActive ? 0.8 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width="120" height="106" viewBox="0 0 80 70">
        {/* Body */}
        <ellipse cx="40" cy="52" rx="20" ry="14" fill="#d4a070" />
        {/* Tail */}
        <motion.path
          stroke="#d4a070"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={
            isActive || reacting
              ? { d: ["M58 46 C62 42 64 34 62 28", "M58 46 C63 38 65 28 63 22", "M58 46 C62 42 64 34 62 28"] }
              : { d: "M58 52 C60 50 60 47 59 44" }
          }
          transition={{ duration: isActive || reacting ? 0.4 : 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Head */}
        <motion.g
          animate={
            reacting
              ? { y: [0, -2, 0], rotate: [0, 3, -3, 0] }
              : !isActive
              ? { y: 2, rotate: 3 }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration: reacting ? 0.4 : 1, ease: "easeInOut" }}
        >
          <circle cx="40" cy="31" r="14" fill="#e0b080" />
          {/* Floppy ears */}
          <ellipse cx="27" cy="28" rx="5.5" ry="10" fill="#b07050" transform="rotate(-10 27 28)" />
          <ellipse cx="53" cy="28" rx="5.5" ry="10" fill="#b07050" transform="rotate(10 53 28)" />
          {/* Eyes */}
          {!isActive ? (
            <>
              <path d="M34 30 C35 29 38 29 39 30" stroke="#2a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M41 30 C42 29 45 29 46 30" stroke="#2a1a1a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="35" cy="29" r="3" fill="#2a1a1a" />
              <circle cx="45" cy="29" r="3" fill="#2a1a1a" />
              <circle cx="35.5" cy="28" r="1" fill="white" />
              <circle cx="45.5" cy="28" r="1" fill="white" />
            </>
          )}
          {/* Nose */}
          <ellipse cx="40" cy="34" rx="3" ry="2" fill="#2a1a1a" />
          {/* Tongue when active */}
          {isActive && (
            <motion.ellipse
              cx="40" cy="38" rx="2" ry="2.5" fill="#e07070"
              animate={{ scaleY: [1, 1.15, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </motion.g>
        {/* Paws */}
        <ellipse cx="32" cy="63" rx="5" ry="2.5" fill="#c09060" />
        <ellipse cx="48" cy="63" rx="5" ry="2.5" fill="#c09060" />
        {/* Zzz when idle */}
        {!isActive && (
          <motion.g
            animate={{ opacity: [0, 1, 0], y: [0, -6, -12] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <text x="55" y="18" fontSize="9" fill="white" opacity="0.5">z</text>
            <text x="60" y="12" fontSize="7" fill="white" opacity="0.35">z</text>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}


// === Sticky Note Todo ===

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

function StickyNoteTodo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(1);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos((prev) => [...prev, { id: nextId.current++, text: input.trim(), done: false }]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      className="absolute top-[80px] left-[20px] z-20 cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      whileDrag={{ scale: 1.05 }}
    >
      <div
        className="w-[210px] min-h-[180px] rounded-[16px] p-4 flex flex-col overflow-hidden"
        style={{
          background: "rgba(18, 18, 32, 0.7)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <h3 className="text-[12px] font-semibold mb-3 pb-2 border-b border-white/10 text-[#F3EBDD]">
          To Do
        </h3>

        {/* Todo list */}
        <div className="space-y-2 flex-1 max-h-[140px] overflow-y-auto">
          {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2 group">
              <button
                onClick={() => toggleTodo(todo.id)}
                className="w-3.5 h-3.5 rounded-sm border border-[#F6B56B]/40 flex-shrink-0 flex items-center justify-center transition-colors"
                style={{ background: todo.done ? "rgba(246,181,107,0.3)" : "transparent" }}
              >
                {todo.done && (
                  <svg width="8" height="8" viewBox="0 0 10 10">
                    <path d="M2 5 L4 7 L8 3" stroke="#F6B56B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <span
                className="text-[11px] leading-tight flex-1"
                style={{
                  color: todo.done ? "rgba(183,180,199,0.5)" : "#F3EBDD",
                  textDecoration: todo.done ? "line-through" : "none",
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-[10px] text-[#B7B4C7]/30 hover:text-[#F3EBDD] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
          {todos.length === 0 && (
            <p className="text-[10px] italic text-[#B7B4C7]/40">
              Add your tasks...
            </p>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="New task..."
            className="min-w-0 flex-1 text-[11px] h-[28px] px-2.5 rounded-lg bg-white/5 border border-white/10 outline-none text-[#F3EBDD] placeholder:text-[#B7B4C7]/30 focus:border-[#F6B56B]/30"
          />
          <button
            onClick={addTodo}
            className="text-[13px] w-[28px] h-[28px] flex items-center justify-center rounded-lg font-semibold text-[#F6B56B] bg-[#F6B56B]/10 border border-[#F6B56B]/20 hover:bg-[#F6B56B]/20 transition-colors flex-shrink-0"
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
}
