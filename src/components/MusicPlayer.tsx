import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'Cyber Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400'
  },
  {
    id: '2',
    title: 'Midnight Pulse',
    artist: 'Retro Wave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400'
  },
  {
    id: '3',
    title: 'Electric Dreams',
    artist: 'Future Bass',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#0ff] p-8 shadow-[8px_8px_0_#f0f] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#f0f] animate-noise opacity-50" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex flex-col items-center gap-8">
        {/* Album Art */}
        <div className="relative">
          <motion.div 
            key={currentTrack.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-64 h-64 border-4 border-[#0ff] overflow-hidden shadow-[4px_4px_0_#f0f]"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className={`w-full h-full object-cover grayscale contrast-150 ${isPlaying ? 'animate-noise' : ''}`}
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          {/* Visualizer bars overlay */}
          <div className="absolute bottom-0 left-0 w-full flex items-end gap-1 h-12 px-2">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: isPlaying ? [4, 40, 10, 48, 20] : 4 }}
                transition={{ repeat: Infinity, duration: 0.2 + Math.random() * 0.3, ease: "linear" }}
                className="flex-1 bg-[#f0f]"
              />
            ))}
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center space-y-2 w-full">
          <h3 className="text-2xl font-display text-[#0ff] tracking-tighter uppercase glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#f0f] font-display text-[10px] uppercase tracking-[0.3em]">
            {">"} {currentTrack.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-4 w-full bg-[#0ff]/20 border-2 border-[#0ff] relative">
            <motion.div 
              className="h-full bg-[#f0f]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] font-display text-white mix-blend-difference">
                DATA_STREAM: {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between w-full">
          <button 
            onClick={prevTrack}
            className="p-2 text-[#0ff] hover:text-[#f0f] transition-colors"
          >
            <SkipBack size={32} />
          </button>

          <button 
            onClick={togglePlay}
            className="px-8 py-4 bg-[#0ff] text-black font-display font-bold hover:bg-[#f0f] transition-all shadow-[4px_4px_0_#fff]"
          >
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>

          <button 
            onClick={nextTrack}
            className="p-2 text-[#0ff] hover:text-[#f0f] transition-colors"
          >
            <SkipForward size={32} />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full">
          <span className="text-[8px] font-display text-[#0ff]">VOL_LVL</span>
          <div className="flex-1 h-2 bg-[#0ff]/20 border border-[#0ff]">
            <div className="w-2/3 h-full bg-[#0ff]" />
          </div>
        </div>
      </div>
    </div>
  );
};
