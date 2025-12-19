"use client";

import { useState, useRef, useEffect } from "react";
import { Song } from "@/data/types";

interface PlaylistItemProps {
  song: Song;
  index: number;
  isCurrentTrack?: boolean;
  playlistMode?: boolean;
  onTrackEnd?: () => void;
  setAudioRef?: (element: HTMLAudioElement | null) => void;
}

export default function PlaylistItem({
  song,
  index,
  isCurrentTrack = false,
  playlistMode = false,
  onTrackEnd,
  setAudioRef
}: PlaylistItemProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Pass audio ref to parent
  useEffect(() => {
    if (setAudioRef && audioRef.current) {
      setAudioRef(audioRef.current);
    }
  }, [setAudioRef]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Pause all other audio elements first
      document.querySelectorAll("audio").forEach((a) => {
        if (a !== audio) {
          a.pause();
        }
      });
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onTrackEnd) {
      onTrackEnd();
    }
  };

  return (
    <div
      className={`border-4 border-black p-3 transition-colors ${
        isCurrentTrack
          ? 'bg-[#F5A6EC] hover:bg-[#F5A6EC]'
          : 'bg-white hover:bg-[#F2FF3D]/20'
      }`}
    >
      <audio
        ref={audioRef}
        src={song.audioUrl}
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-3">
        {/* Track number or NOW PLAYING indicator */}
        <div className="w-8 text-center">
          {isCurrentTrack ? (
            <span className="text-[#532563] font-bold text-xs">▶</span>
          ) : (
            <span className="text-[#532563] font-bold text-lg">{index + 1}</span>
          )}
        </div>

        {/* Play button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 bg-[#532563] border-2 border-black flex items-center justify-center hover:bg-[#F5A6EC] transition-colors flex-shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#532563] truncate">{song.title}</p>
          <p className="text-sm text-[#532563]/70 truncate">{song.fartist}</p>
        </div>

        {/* Duration */}
        <span className="text-[#532563]/70 text-sm font-mono">
          {isPlaying ? formatTime(currentTime) : formatTime(duration)}
        </span>

        {/* Download button */}
        <a
          href={song.audioUrl}
          download={`${song.fartist} - ${song.title}.mp3`}
          className="w-10 h-10 bg-[#C6FF5D] border-2 border-black flex items-center justify-center hover:bg-[#F5A6EC] transition-colors flex-shrink-0 no-underline"
          aria-label="Download"
        >
          <svg className="w-4 h-4 text-[#532563]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      </div>

      {/* Progress bar (only show when playing or has progress) */}
      {(isPlaying || currentTime > 0) && duration > 0 && (
        <div
          className="mt-2 h-1 bg-[#532563]/20 cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-[#532563] transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
