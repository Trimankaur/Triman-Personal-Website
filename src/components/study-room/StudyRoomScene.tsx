"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Play, Pause, RotateCcw, SkipForward, Volume2, Cat, Dog } from "lucide-react";
import Link from "next/link";

type TimerMode = "25min" | "50min" | "custom";
type PetType = "cat" | "dog";

interface AmbienceOption { id: string; label: string; icon: string; url: string; }

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

const DOG_WELLNESS_PROMPTS = ["Stay with it, human 🐾","One session at a time 🌙","Small progress is still progress","Focus first, scroll later 👀"];
const DOG_END_PROMPTS = ["Almost break time!","You're doing amazing 🌟","Finish strong 💪"];
const DOG_BREAK_PROMPTS = ["Good job! Rest now 🐶","You earned this break 🎉","Stretch those legs! 🐾"];
const CAT_WELLNESS_PROMPTS = ["Don't forget to blink 👀","Humans need water too 💧","Stretch before you become a chair","Your posture concerns me.","Take a deep breath 🌱"];
const CAT_END_PROMPTS = ["Almost done. Impressive.","Rest your eyes for a moment","You survived. Barely."];
const CAT_BREAK_PROMPTS = ["You've earned a cozy break ☕","Nap time. For both of us.","Finally, some peace."];

function pickRandom(arr: string[], usedSet: Set<string>): string {
  const available = arr.filter((m) => !usedSet.has(m));
  const pool = available.length > 0 ? available : arr;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  usedSet.add(pick);
  if (usedSet.size >= arr.length) usedSet.clear();
  return pick;
}

export default function StudyRoomScene() {
  const [mode, setMode] = useState<TimerMode>("25min");
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [customFocus, setCustomFocus] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedRef = useRef(0);
  const [activeAmbience, setActiveAmbience] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [pet, setPet] = useState<PetType>("cat");
  const [reminder, setReminder] = useState<string | null>(null);
  const [petReacting, setPetReacting] = useState(false);
  const [showTodo, setShowTodo] = useState(true);
  const [streak, setStreak] = useState(0);
  const usedPromptsRef = useRef(new Set<string>());
  const streakIncrementedRef = useRef(false);
  const [todos, setTodos] = useState<{id:number;text:string;done:boolean}[]>([]);
  const [todoInput, setTodoInput] = useState("");
  const todoNextId = useRef(1);

  const getWorkTime = useCallback(() => {
    switch (mode) { case "25min": return 25*60; case "50min": return 50*60; case "custom": return customFocus*60; }
  }, [mode, customFocus]);
  const getBreakTime = useCallback(() => {
    switch (mode) { case "25min": return 5*60; case "50min": return 10*60; case "custom": return customBreak*60; }
  }, [mode, customBreak]);

  useEffect(() => { const i = setInterval(() => setQuoteIndex((p) => (p+1)%QUOTES.length), 10000); return () => clearInterval(i); }, []);

  useEffect(() => {
    if (isRunning && !isBreak) {
      streakIncrementedRef.current = false;
      const msg = pet === "dog" ? "Let's focus together 🐶" : "Let's focus together 🐱";
      setReminder(msg); setPetReacting(true);
      const t = setTimeout(() => { setReminder(null); setPetReacting(false); }, 4000);
      return () => { clearTimeout(t); setReminder(null); setPetReacting(false); };
    } else if (!isRunning && !isBreak) { setReminder(null); setPetReacting(false); }
  }, [isRunning, isBreak, pet]);

  useEffect(() => {
    if (isBreak) {
      const prompts = pet === "dog" ? DOG_BREAK_PROMPTS : CAT_BREAK_PROMPTS;
      const msg = pickRandom(prompts, usedPromptsRef.current);
      setReminder(msg); setPetReacting(true);
      const t = setTimeout(() => { setReminder(null); setPetReacting(false); }, 5000);
      return () => clearTimeout(t);
    }
  }, [isBreak, pet]);

  useEffect(() => {
    if (!isRunning || isBreak) { elapsedRef.current = 0; return; }
    const totalMinutes = getWorkTime() / 60;
    const ri = setInterval(() => {
      elapsedRef.current += 1;
      const elapsed = elapsedRef.current, remaining = totalMinutes - elapsed;
      if (remaining <= 3 && remaining >= 2) {
        const p = pet === "dog" ? DOG_END_PROMPTS : CAT_END_PROMPTS;
        setReminder(pickRandom(p, usedPromptsRef.current)); setPetReacting(true);
        setTimeout(() => { setReminder(null); setPetReacting(false); }, 5000); return;
      }
      if (elapsed > 0 && elapsed % 10 === 0 && remaining > 3) {
        const p = pet === "dog" ? DOG_WELLNESS_PROMPTS : CAT_WELLNESS_PROMPTS;
        setReminder(pickRandom(p, usedPromptsRef.current)); setPetReacting(true);
        setTimeout(() => { setReminder(null); setPetReacting(false); }, 5000);
      }
    }, 60000);
    return () => clearInterval(ri);
  }, [isRunning, isBreak, pet, getWorkTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            if (!isBreak) {
              setIsBreak(true);
              if (!streakIncrementedRef.current) { streakIncrementedRef.current = true; setStreak((s) => s+1); }
              return getBreakTime();
            } else { setIsBreak(false); setIsRunning(false); streakIncrementedRef.current = false; return getWorkTime(); }
          }
          return prev - 1;
        });
      }, 1000);
    } else { if (intervalRef.current) clearInterval(intervalRef.current); }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isBreak, getWorkTime, getBreakTime]);

  const changeMode = (m: TimerMode) => { setMode(m); setIsRunning(false); setIsBreak(false); setTimeLeft(m==="25min"?25*60:m==="50min"?50*60:customFocus*60); };
  const reset = () => { setIsRunning(false); setIsBreak(false); setTimeLeft(getWorkTime()); };
  const skipBreak = () => { if (isBreak) { setIsBreak(false); setTimeLeft(getWorkTime()); } };

  const playAmbience = async (id: string) => {
    if (activeAmbience === id) { audioRef.current?.pause(); setActiveAmbience(null); return; }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    const sound = AMBIENCE.find((a) => a.id === id); if (!sound) return;
    const audio = new Audio(sound.url); audio.loop = true; audio.volume = volume; audioRef.current = audio;
    try { await audio.play(); setActiveAmbience(id); } catch {}
  };
  const handleVolumeChange = (v: number) => { setVolume(v); if (audioRef.current) audioRef.current.volume = v; };
  useEffect(() => { return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; } }; }, []);

  const addTodo = () => { if (!todoInput.trim()) return; setTodos(p => [...p, {id: todoNextId.current++, text: todoInput.trim(), done: false}]); setTodoInput(""); };
  const toggleTodo = (id: number) => setTodos(p => p.map(t => t.id===id ? {...t, done:!t.done} : t));
  const removeTodo = (id: number) => setTodos(p => p.filter(t => t.id !== id));

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative w-full h-full">
      {/* Background - fixed on all screens */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/study-room-bg.png" alt="Cozy study room" className="fixed inset-0 w-full h-full object-cover object-center" draggable={false} />
      <div className="fixed inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />

      {/* Scrollable content layer */}
      <div className="relative z-10 w-full h-full overflow-y-auto">
        <div className="min-h-full flex flex-col max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-5 gap-4 lg:gap-6">

          {/* Home - always at top */}
          <Link href="/" className="self-start flex items-center gap-1.5 text-[12px] text-[#ccc] hover:text-white transition-colors bg-white/5 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
            <Home className="h-3.5 w-3.5" /><span>Home</span>
          </Link>

          {/* Main content: two columns on desktop */}
          <div className="flex flex-col lg:flex-row flex-1 gap-4 lg:gap-6">

          {/* LEFT COLUMN: Todo (top) + Pet (bottom) */}
          <div className="flex flex-col gap-3 lg:w-[250px] lg:self-stretch order-2 lg:order-1">
            {/* Todo - right under home on desktop */}
            {showTodo && <TodoCard todos={todos} todoInput={todoInput} setTodoInput={setTodoInput} addTodo={addTodo} toggleTodo={toggleTodo} removeTodo={removeTodo} />}

            {/* Spacer to push pet to bottom on desktop */}
            <div className="hidden lg:flex lg:flex-1" />

            {/* Pet with speech bubble */}
            <div className="relative self-start">
              <AnimatePresence>
                {reminder && (
                  <motion.div className="absolute -top-11 left-2 whitespace-nowrap z-10" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                    <div className="px-3 py-1.5 rounded-xl text-[11px] font-medium text-[#F3EBDD]" style={{background:"rgba(18,18,32,0.8)",backdropFilter:"blur(10px)",border:"1px solid rgba(246,181,107,0.2)"}}>
                      {reminder}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div animate={petReacting ? {y:[0,-4,0]} : isRunning&&!isBreak ? {y:[0,-1,0]} : {y:[0,1,0]}} transition={{duration: petReacting?0.5:isRunning?1.5:3, repeat:Infinity}}>
                {pet === "cat" ? <CatSVG /> : <DogSVG />}
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN: Control Panel */}
          <div className="w-full lg:w-[380px] order-1 lg:order-2 lg:self-center lg:ml-auto">
            <div className="rounded-[24px] p-5 sm:p-6 flex flex-col gap-4 sm:gap-5" style={{background:"rgba(18,18,32,0.75)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
              {/* Modes */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#B7B4C7]/60 mb-2 font-medium">Focus Mode</p>
                <div className="flex gap-2">
                  {([{id:"25min" as const,label:"Focus Mode"},{id:"50min" as const,label:"Deep Work"},{id:"custom" as const,label:"Custom"}]).map((m) => (
                    <button key={m.id} onClick={() => changeMode(m.id)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-medium flex-1 transition-all ${mode===m.id?"text-[#F6B56B]":"text-[#B7B4C7]/70"}`}
                      style={{background:mode===m.id?"rgba(246,181,107,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${mode===m.id?"rgba(246,181,107,0.25)":"rgba(255,255,255,0.05)"}`}}>
                      {m.label}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {mode === "custom" && (
                    <motion.div className="flex gap-3 mt-3" initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}>
                      <div className="flex-1">
                        <label className="text-[9px] text-[#B7B4C7]/50 mb-1 block">Focus (min)</label>
                        <input type="number" min={1} max={120} value={customFocus} onChange={(e)=>{const v=Number(e.target.value);setCustomFocus(v);if(!isRunning)setTimeLeft(v*60);}}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[12px] text-[#F3EBDD] outline-none" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[9px] text-[#B7B4C7]/50 mb-1 block">Break (min)</label>
                        <input type="number" min={1} max={60} value={customBreak} onChange={(e)=>setCustomBreak(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[12px] text-[#F3EBDD] outline-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ambience */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#B7B4C7]/60 mb-2 font-medium">Ambience</p>
                <div className="flex gap-2 mb-3">
                  {AMBIENCE.map((s) => (
                    <button key={s.id} onClick={() => playAmbience(s.id)}
                      className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-xl flex-1 transition-all ${activeAmbience===s.id?"text-[#F6B56B]":"text-[#B7B4C7]/70"}`}
                      style={{background:activeAmbience===s.id?"rgba(246,181,107,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${activeAmbience===s.id?"rgba(246,181,107,0.2)":"rgba(255,255,255,0.05)"}`}}>
                      <span className="text-[16px] sm:text-[18px]">{s.icon}</span>
                      <span className="text-[8px] sm:text-[9px] font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="h-3.5 w-3.5 text-[#B7B4C7]/50 flex-shrink-0" />
                  <div className="relative flex-1 h-[4px] bg-white/10 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full rounded-full bg-[#F6B56B]/70 transition-all" style={{width:`${volume*100}%`}} />
                    <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e)=>handleVolumeChange(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                  <span className="text-[9px] text-[#B7B4C7]/40 w-[28px] text-right flex-shrink-0">{Math.round(volume*100)}%</span>
                </div>
              </div>

              {/* Timer */}
              <div className="flex flex-col items-center py-2 sm:py-3">
                <motion.span animate={isRunning?{scale:[1,1.01,1]}:{}} transition={{duration:2,repeat:Infinity}}
                  className="text-[48px] sm:text-[56px] lg:text-[64px] font-light tracking-wider font-mono text-[#F3EBDD]"
                  style={{textShadow:isRunning?"0 0 30px rgba(246,181,107,0.3)":"0 0 20px rgba(243,235,221,0.1)"}}>
                  {String(minutes).padStart(2,"0")}:{String(seconds).padStart(2,"0")}
                </motion.span>
                <span className="text-[11px] text-[#B7B4C7]/60 mt-1 font-medium">{isBreak?"Break Time":isRunning?"Focusing...":"Ready to focus"}</span>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-4">
                  <button onClick={reset} className="p-3 rounded-full bg-white/5 text-[#B7B4C7]/60 hover:text-[#F3EBDD] border border-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center"><RotateCcw className="h-4 w-4" /></button>
                  <button onClick={() => setIsRunning(!isRunning)} className="p-5 rounded-full min-w-[56px] min-h-[56px] flex items-center justify-center"
                    style={{background:isRunning?"rgba(246,181,107,0.15)":"rgba(246,181,107,0.1)",border:"1px solid rgba(246,181,107,0.3)",boxShadow:isRunning?"0 0 30px rgba(246,181,107,0.15)":"0 0 20px rgba(246,181,107,0.08)"}}>
                    {isRunning ? <Pause className="h-5 w-5 text-[#F6B56B]" /> : <Play className="h-5 w-5 text-[#F6B56B] ml-[2px]" />}
                  </button>
                  <button onClick={skipBreak} className={`p-3 rounded-full bg-white/5 border border-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center ${isBreak?"text-[#B7B4C7] hover:text-[#F3EBDD]":"text-[#B7B4C7]/20 cursor-not-allowed"}`}><SkipForward className="h-4 w-4" /></button>
                </div>
                {isBreak && <p className="text-[10px] text-[#B7B4C7]/50 italic">Press skip to end break early</p>}
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {Array.from({length:Math.min(streak,8)}).map((_,i) => <span key={i} className="text-[14px]">⭐</span>)}
                  {streak > 8 && <span className="text-[10px] text-[#F6B56B] font-medium ml-1">+{streak-8}</span>}
                </div>
                {streak > 0 && <span className="text-[10px] text-[#B7B4C7]/50 ml-auto">{streak} session{streak>1?"s":""} ☑️</span>}
                {streak === 0 && <span className="text-[10px] text-[#B7B4C7]/40 italic">Complete a session to earn stars</span>}
              </div>

              {/* Pet + Todo toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={()=>setPet("cat")} className={`p-2 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center ${pet==="cat"?"text-[#F6B56B]":"text-[#B7B4C7]/70"}`}
                    style={{background:pet==="cat"?"rgba(246,181,107,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${pet==="cat"?"rgba(246,181,107,0.2)":"rgba(255,255,255,0.05)"}`}}><Cat className="h-4 w-4" /></button>
                  <button onClick={()=>setPet("dog")} className={`p-2 rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center ${pet==="dog"?"text-[#F6B56B]":"text-[#B7B4C7]/70"}`}
                    style={{background:pet==="dog"?"rgba(246,181,107,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${pet==="dog"?"rgba(246,181,107,0.2)":"rgba(255,255,255,0.05)"}`}}><Dog className="h-4 w-4" /></button>
                </div>
                <button onClick={()=>setShowTodo(!showTodo)} className={`px-3 py-2 rounded-lg text-[10px] font-medium min-h-[36px] ${showTodo?"text-[#F6B56B]":"text-[#B7B4C7]/70"}`}
                  style={{background:showTodo?"rgba(246,181,107,0.1)":"rgba(255,255,255,0.03)",border:`1px solid ${showTodo?"rgba(246,181,107,0.2)":"rgba(255,255,255,0.05)"}`}}>To Do</button>
              </div>
            </div>
          </div>

          </div>{/* end flex-row */}

          {/* QUOTE - bottom center on desktop, inline on mobile */}
          <div className="lg:absolute lg:bottom-6 lg:left-0 lg:right-0 lg:flex lg:justify-center">
            <AnimatePresence mode="wait">
              <motion.p key={quoteIndex} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.5}}
                className="text-[12px] sm:text-[13px] lg:text-[14px] text-white font-medium italic text-center" style={{textShadow:"0 2px 8px rgba(0,0,0,0.5)"}}>
                &ldquo;{QUOTES[quoteIndex]}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>

        </div>{/* end flex-col */}
      </div>{/* end scrollable */}
    </div>
  );
}

// === Sub-components ===

function TodoCard({todos, todoInput, setTodoInput, addTodo, toggleTodo, removeTodo}: {
  todos:{id:number;text:string;done:boolean}[]; todoInput:string; setTodoInput:(v:string)=>void;
  addTodo:()=>void; toggleTodo:(id:number)=>void; removeTodo:(id:number)=>void;
}) {
  return (
    <div className="w-full rounded-[16px] p-4 flex flex-col overflow-hidden" style={{background:"rgba(18,18,32,0.7)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.08)"}}>
      <h3 className="text-[12px] font-semibold text-[#F3EBDD] pb-2 mb-2 border-b border-white/10">To Do</h3>
      <div className="space-y-2 flex-1 max-h-[120px] overflow-y-auto">
        {todos.map((t) => (
          <div key={t.id} className="flex items-center gap-2 group">
            <button onClick={()=>toggleTodo(t.id)} className="w-4 h-4 rounded-sm border border-[#F6B56B]/40 flex-shrink-0 flex items-center justify-center"
              style={{background:t.done?"rgba(246,181,107,0.3)":"transparent"}}>
              {t.done && <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5 L4 7 L8 3" stroke="#F6B56B" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
            </button>
            <span className="text-[11px] flex-1" style={{color:t.done?"rgba(183,180,199,0.5)":"#F3EBDD",textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
            <button onClick={()=>removeTodo(t.id)} className="text-[10px] text-[#B7B4C7]/30 hover:text-[#F3EBDD] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
        {todos.length===0 && <p className="text-[10px] italic text-[#B7B4C7]/40">Add your tasks...</p>}
      </div>
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
        <input type="text" value={todoInput} onChange={(e)=>setTodoInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&addTodo()} placeholder="New task..."
          className="flex-1 min-w-0 text-[11px] h-[30px] px-2.5 rounded-lg bg-white/5 border border-white/10 outline-none text-[#F3EBDD] placeholder:text-[#B7B4C7]/30 focus:border-[#F6B56B]/30" />
        <button onClick={addTodo} className="text-[13px] w-[30px] h-[30px] flex items-center justify-center rounded-lg text-[#F6B56B] bg-[#F6B56B]/10 border border-[#F6B56B]/20 flex-shrink-0">+</button>
      </div>
    </div>
  );
}

function CatSVG() {
  return (
    <svg width="120" height="106" viewBox="0 0 80 70">
      <ellipse cx="40" cy="52" rx="20" ry="14" fill="#6a6060" />
      <circle cx="40" cy="32" r="14" fill="#7a7070" />
      <polygon points="29,22 24,8 34,18" fill="#7a7070" />
      <polygon points="51,22 56,8 46,18" fill="#7a7070" />
      <polygon points="29.5,21 25.5,10 33,18" fill="rgba(212,144,128,0.5)" />
      <polygon points="50.5,21 54.5,10 47,18" fill="rgba(212,144,128,0.5)" />
      <circle cx="35" cy="31" r="2.5" fill="#1a1a1a" />
      <circle cx="45" cy="31" r="2.5" fill="#1a1a1a" />
      <circle cx="35.5" cy="30" r="0.8" fill="white" />
      <circle cx="45.5" cy="30" r="0.8" fill="white" />
      <ellipse cx="40" cy="35" rx="2" ry="1.3" fill="#d49080" />
      <line x1="26" y1="33" x2="33" y2="34" stroke="#9a9090" strokeWidth="0.5" />
      <line x1="26" y1="36" x2="33" y2="36" stroke="#9a9090" strokeWidth="0.5" />
      <line x1="54" y1="33" x2="47" y2="34" stroke="#9a9090" strokeWidth="0.5" />
      <line x1="54" y1="36" x2="47" y2="36" stroke="#9a9090" strokeWidth="0.5" />
      <ellipse cx="32" cy="63" rx="4.5" ry="2.5" fill="#5a5454" />
      <ellipse cx="48" cy="63" rx="4.5" ry="2.5" fill="#5a5454" />
    </svg>
  );
}

function DogSVG() {
  return (
    <svg width="120" height="106" viewBox="0 0 80 70">
      <ellipse cx="40" cy="52" rx="20" ry="14" fill="#d4a070" />
      <circle cx="40" cy="31" r="14" fill="#e0b080" />
      <ellipse cx="27" cy="28" rx="5.5" ry="10" fill="#b07050" transform="rotate(-10 27 28)" />
      <ellipse cx="53" cy="28" rx="5.5" ry="10" fill="#b07050" transform="rotate(10 53 28)" />
      <circle cx="35" cy="29" r="3" fill="#2a1a1a" />
      <circle cx="45" cy="29" r="3" fill="#2a1a1a" />
      <circle cx="35.5" cy="28" r="1" fill="white" />
      <circle cx="45.5" cy="28" r="1" fill="white" />
      <ellipse cx="40" cy="34" rx="3" ry="2" fill="#2a1a1a" />
      <ellipse cx="40" cy="38" rx="2" ry="2.5" fill="#e07070" />
      <ellipse cx="32" cy="63" rx="5" ry="2.5" fill="#c09060" />
      <ellipse cx="48" cy="63" rx="5" ry="2.5" fill="#c09060" />
    </svg>
  );
}
