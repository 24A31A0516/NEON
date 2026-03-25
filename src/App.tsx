import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] font-sans selection:bg-[#f0f] selection:text-black overflow-hidden relative">
      {/* CRT Effects */}
      <div className="crt-overlay" />
      <div className="static-noise" />
      <div className="scanline" />

      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-center gap-16 min-h-screen">
        
        {/* Left Side: Cryptic Content */}
        <div className="flex-1 max-w-xl space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "linear" }}
          >
            <span className="text-[#f0f] font-display text-xs tracking-widest uppercase mb-6 block animate-pulse">
              [ INITIALIZING SYSTEM_CORE ]
            </span>
            <h1 className="text-6xl lg:text-8xl font-display tracking-tight leading-none uppercase mb-8 glitch-text" data-text="NEON_VOID">
              NEON_VOID
            </h1>
            <div className="space-y-4 border-l-4 border-[#f0f] pl-6 py-2">
              <p className="text-[#0ff] text-2xl font-bold leading-tight uppercase">
                INPUT_STREAM: DETECTED
              </p>
              <p className="text-[#0ff]/60 text-xl leading-relaxed font-mono">
                {">"} PROTOCOL: ARCADE_RECONSTRUCTION<br />
                {">"} STATUS: UNSTABLE<br />
                {">"} FREQUENCY: 44.1KHZ_OVERRIDE
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            <div className="px-6 py-2 bg-[#f0f] text-black font-display text-xs uppercase tracking-tighter shadow-[4px_4px_0_#0ff]">
              LIVE_DATA_FEED
            </div>
            <div className="px-6 py-2 border-2 border-[#0ff] text-[#0ff] font-display text-xs uppercase tracking-tighter shadow-[4px_4px_0_#f0f]">
              BPM_SYNC: ACTIVE
            </div>
          </motion.div>
        </div>

        {/* Center: Snake Game */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "linear" }}
          className="flex-shrink-0 relative"
        >
          <div className="absolute -inset-4 border-4 border-[#f0f] animate-glitch-skew opacity-50 pointer-events-none" />
          <SnakeGame />
        </motion.div>

        {/* Right Side: Music Player */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "linear" }}
          className="flex-shrink-0"
        >
          <MusicPlayer />
        </motion.div>

      </main>

      {/* Footer Rail */}
      <footer className="fixed bottom-0 left-0 w-full p-4 flex justify-between items-center z-20 border-t-4 border-[#0ff] bg-black">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#f0f] uppercase font-display">SIGNAL_LOSS</span>
            <span className="text-xl font-mono text-[#0ff]">0.0003%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-[#f0f] uppercase font-display">ENTROPY_LVL</span>
            <span className="text-xl font-mono text-[#0ff]">CRITICAL</span>
          </div>
        </div>
        
        <div className="text-xs text-[#0ff]/40 uppercase font-display hidden lg:block tracking-[0.5em]">
          TERMINAL_ID: 0xDEADBEEF // ACCESS_GRANTED
        </div>

        <div className="flex items-center gap-6">
          <div className="w-24 h-4 bg-[#f0f] animate-noise" />
          <span className="text-lg font-display text-[#f0f] italic">2026_V.4</span>
        </div>
      </footer>
    </div>
  );
}
