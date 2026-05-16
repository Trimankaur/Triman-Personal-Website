"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useStudyRoom } from "./StudyRoomContext";

interface SoundOption {
  id: string;
  label: string;
  icon: string;
  url: string;
}

const SOUNDS: SoundOption[] = [
  { id: "lofi", label: "Lofi", icon: "🎵", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" },
  { id: "fireplace", label: "Fireplace", icon: "🔥", url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3" },
  { id: "forest", label: "Forest", icon: "🌲", url: "https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf5bf94.mp3" },
  { id: "ocean", label: "Ocean", icon: "🌊", url: "https://cdn.pixabay.com/audio/2022/06/07/audio_b9bd4170e4.mp3" },
];

export default function AmbientSounds() {
  const { setIsMusicPlaying } = useStudyRoom();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playSound = async (index: number) => {
    const sound = SOUNDS[index];
    if (!sound) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio(sound.url);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    audio.onerror = () => {
      setIsPlaying(false);
      setIsMusicPlaying(false);
    };

    try {
      await audio.play();
      setActiveIndex(index);
      setIsPlaying(true);
      setIsMusicPlaying(true);
    } catch {
      setIsPlaying(false);
      setIsMusicPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current || !isPlaying) {
      await playSound(activeIndex);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsMusicPlaying(false);
    }
  };

  const selectSound = (index: number) => {
    if (index === activeIndex && isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setIsMusicPlaying(false);
    } else {
      playSound(index);
    }
  };

  return (
    <div className="flex items-center gap-6 w-full">
      {/* Ambience selector */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold text-[#F3EBDD] whitespace-nowrap">
          Ambience
        </span>
        <div className="flex items-center gap-1">
          {SOUNDS.map((sound, i) => (
            <motion.button
              key={sound.id}
              onClick={() => selectSound(i)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${
                activeIndex === i && isPlaying
                  ? "bg-[#F6B56B]/15 border border-[#F6B56B]/30"
                  : "bg-transparent border border-transparent hover:bg-[#1a1a2e]/40"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-[13px]">{sound.icon}</span>
              <span
                className={`text-[8px] font-medium ${
                  activeIndex === i && isPlaying
                    ? "text-[#F6B56B]"
                    : "text-[#B7B4C7]/60"
                }`}
              >
                {sound.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Now Playing + Play button */}
      <div className="flex items-center gap-3 ml-auto">
        {isPlaying && (
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[2px] h-[12px]">
              <motion.div
                className="w-[2px] rounded-full bg-[#F6B56B]"
                animate={{ height: ["4px", "12px", "4px"] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
              <motion.div
                className="w-[2px] rounded-full bg-[#F6B56B]"
                animate={{ height: ["8px", "4px", "8px"] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
              />
              <motion.div
                className="w-[2px] rounded-full bg-[#F6B56B]"
                animate={{ height: ["3px", "10px", "3px"] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="w-[2px] rounded-full bg-[#F6B56B]"
                animate={{ height: ["6px", "3px", "6px"] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.45 }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-[#F3EBDD]">
                {SOUNDS[activeIndex].label}
              </span>
              <span className="text-[8px] text-[#B7B4C7]/60">
                chill · study · relax
              </span>
            </div>
          </div>
        )}

        {/* Play/Pause button */}
        <motion.button
          onClick={togglePlay}
          className="p-2.5 rounded-full transition-all"
          style={{
            background: isPlaying
              ? "rgba(246,181,107,0.2)"
              : "rgba(246,181,107,0.12)",
            border: "1px solid rgba(246,181,107,0.3)",
          }}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          {isPlaying ? (
            <Pause className="h-3.5 w-3.5 text-[#F6B56B]" />
          ) : (
            <Play className="h-3.5 w-3.5 text-[#F6B56B] ml-[1px]" />
          )}
        </motion.button>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#B7B4C7] hover:text-[#F3EBDD] transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>
          <div className="relative w-[80px] sm:w-[100px] h-[4px] bg-[#2a2a4a] rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#F6B56B] transition-all"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setIsMuted(false);
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
