"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Square } from "lucide-react";
import { useStudyRoom, TimerMode } from "./StudyRoomContext";

export default function MonitorTimer() {
  const { setIsTimerRunning, setIsBreak, timerMode, setTimerMode } = useStudyRoom();
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getTime = useCallback((mode: TimerMode) => {
    switch (mode) {
      case "pomodoro": return 25 * 60;
      case "shortBreak": return 5 * 60;
      case "longBreak": return 10 * 60;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer complete
            setIsRunning(false);
            return 0;
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
  }, [isRunning]);

  useEffect(() => {
    setIsTimerRunning(isRunning);
    setIsBreak(timerMode !== "pomodoro");
  }, [isRunning, timerMode, setIsTimerRunning, setIsBreak]);

  const changeMode = (mode: TimerMode) => {
    setTimerMode(mode);
    setIsRunning(false);
    setTimeLeft(getTime(mode));
    setCurrentPhase(mode === "pomodoro" ? "work" : "break");
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(getTime(timerMode));
  };

  const stop = () => {
    setIsRunning(false);
    setTimeLeft(getTime(timerMode));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalTime = getTime(timerMode);
  const progress = 1 - timeLeft / totalTime;
  const circumference = 2 * Math.PI * 58;

  const motivationalText = isRunning
    ? "Stay focused, you got this! 🔥"
    : timeLeft === 0
    ? "Great work! Take a break 🎉"
    : "Ready to focus?";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 py-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-[#F6B56B]">🍅</span>
        <span className="text-[11px] font-semibold text-[#F3EBDD]">Pomodoro</span>
      </div>

      {/* Mode tabs */}
      <div className="flex items-center gap-1 mb-3 bg-[#1a1a2e]/60 rounded-lg p-0.5">
        {(["pomodoro", "shortBreak", "longBreak"] as const).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-3 py-1 rounded-md text-[9px] font-semibold transition-all ${
              timerMode === m
                ? "text-[#F3EBDD] bg-[#2a2a4a]"
                : "text-[#B7B4C7]/50 hover:text-[#B7B4C7]"
            }`}
          >
            {m === "pomodoro" ? "Pomodoro" : m === "shortBreak" ? "Short Break" : "Long Break"}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="relative w-[130px] h-[130px] sm:w-[150px] sm:h-[150px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          {/* Background ring */}
          <circle
            cx="70" cy="70" r="58"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4"
          />
          {/* Progress ring */}
          <circle
            cx="70" cy="70" r="58"
            fill="none"
            stroke={timerMode === "pomodoro" ? "#F6B56B" : "#7AA2F7"}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
            filter="url(#glow)"
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[32px] sm:text-[38px] font-semibold tracking-wider font-mono text-[#F3EBDD]">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-[9px] mt-0.5 font-medium text-[#B7B4C7]">
            {timerMode === "pomodoro" ? "Focus Time" : "Break Time"}
          </span>
        </div>
      </div>

      {/* Motivational text */}
      <p className="text-[9px] text-[#B7B4C7]/70 mt-2 mb-3 italic">
        {motivationalText}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={reset}
          className="p-2.5 rounded-full bg-[#1a1a2e]/60 text-[#B7B4C7]/60 hover:text-[#F3EBDD] transition-colors"
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </motion.button>
        <motion.button
          onClick={() => setIsRunning(!isRunning)}
          className="p-3 rounded-full transition-all"
          style={{
            background: isRunning
              ? "rgba(246,181,107,0.2)"
              : "rgba(246,181,107,0.15)",
            border: "1px solid rgba(246,181,107,0.3)",
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          {isRunning ? (
            <Pause className="h-4 w-4 text-[#F6B56B]" />
          ) : (
            <Play className="h-4 w-4 text-[#F6B56B] ml-[1px]" />
          )}
        </motion.button>
        <motion.button
          onClick={stop}
          className="p-2.5 rounded-full bg-[#1a1a2e]/60 text-[#B7B4C7]/60 hover:text-[#F3EBDD] transition-colors"
          whileTap={{ scale: 0.9 }}
        >
          <Square className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </div>
  );
}
