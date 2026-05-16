"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface StudyRoomState {
  isTimerRunning: boolean;
  setIsTimerRunning: (running: boolean) => void;
  isBreak: boolean;
  setIsBreak: (b: boolean) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;
  timerMode: TimerMode;
  setTimerMode: (mode: TimerMode) => void;
}

const StudyRoomContext = createContext<StudyRoomState>({
  isTimerRunning: false,
  setIsTimerRunning: () => {},
  isBreak: false,
  setIsBreak: () => {},
  isMusicPlaying: false,
  setIsMusicPlaying: () => {},
  timerMode: "pomodoro",
  setTimerMode: () => {},
});

export function StudyRoomProvider({ children }: { children: ReactNode }) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");

  return (
    <StudyRoomContext.Provider
      value={{
        isTimerRunning,
        setIsTimerRunning,
        isBreak,
        setIsBreak,
        isMusicPlaying,
        setIsMusicPlaying,
        timerMode,
        setTimerMode,
      }}
    >
      {children}
    </StudyRoomContext.Provider>
  );
}

export function useStudyRoom() {
  return useContext(StudyRoomContext);
}
