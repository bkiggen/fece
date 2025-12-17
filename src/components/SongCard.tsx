"use client";

import { useState } from "react";
import { Song } from "@/data/types";
import AudioPlayer from "./AudioPlayer";

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const [showLyrics, setShowLyrics] = useState(false);

  const getFileName = () => {
    return `${song.fartist} - ${song.title}.mp3`;
  };

  return (
    <div className="song-card">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[#532563]">
            {song.title}
          </h3>
          <p className="mt-1">
            by <span className="highlight-lime">{song.fartist}</span>
          </p>
        </div>
        <a
          href={song.audioUrl}
          download={getFileName()}
          className="bg-[#532563] text-white font-bold py-2 px-4 border-2 border-black hover:bg-[#F5A6EC] transition-colors flex items-center gap-2 no-underline self-start"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          DOWNLOAD
        </a>
      </div>

      {song.bio && (
        <p className="mt-4 text-sm italic bg-[#F5A6EC]/30 p-3 border-l-4 border-[#F5A6EC]">
          &ldquo;{song.bio}&rdquo;
        </p>
      )}

      <div className="mt-4">
        <AudioPlayer src={song.audioUrl} title={song.title} />
      </div>

      {song.lyrics && (
        <div className="mt-4">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className="bg-[#F2FF3D] text-[#532563] font-bold py-2 px-4 border-2 border-black hover:bg-[#C6FF5D] transition-colors flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showLyrics ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
            {showLyrics ? "HIDE LYRICS" : "SHOW LYRICS"}
          </button>

          {showLyrics && (
            <pre className="mt-3 p-4 bg-[#532563] text-white text-sm whitespace-pre-wrap font-sans overflow-x-auto border-4 border-[#C6FF5D]">
              {song.lyrics}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
