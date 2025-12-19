"use client";

import { useState, useRef, useEffect } from "react";
import { Song } from "@/data/types";
import PlaylistItem from "./PlaylistItem";
import DownloadAllButton from "./DownloadAllButton";

interface PlaylistProps {
  songs: Song[];
  year: number;
}

export default function Playlist({ songs, year }: PlaylistProps) {
  const [playlistMode, setPlaylistMode] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const playlistRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    playlistRefs.current = playlistRefs.current.slice(0, songs.length);
  }, [songs.length]);

  const handlePlayAll = () => {
    if (songs.length === 0) return;

    // Pause all audio first
    playlistRefs.current.forEach(audio => audio?.pause());

    setPlaylistMode(true);
    setCurrentTrackIndex(0);

    // Start playing first track
    setTimeout(() => {
      playlistRefs.current[0]?.play();
    }, 100);
  };

  const handleStopPlaylist = () => {
    setPlaylistMode(false);
    setCurrentTrackIndex(null);
    playlistRefs.current.forEach(audio => audio?.pause());
  };

  const handleTrackEnd = (index: number) => {
    if (!playlistMode) return;

    // Move to next track
    const nextIndex = index + 1;
    if (nextIndex < songs.length) {
      setCurrentTrackIndex(nextIndex);
      setTimeout(() => {
        playlistRefs.current[nextIndex]?.play();
      }, 100);
    } else {
      // Playlist finished
      setPlaylistMode(false);
      setCurrentTrackIndex(null);
    }
  };

  const setAudioRef = (index: number, element: HTMLAudioElement | null) => {
    playlistRefs.current[index] = element;
  };

  if (songs.length === 0) {
    return (
      <div className="bg-white border-4 border-black p-8 text-center">
        <p className="text-[#532563] font-bold text-xl">No songs yet for {year}!</p>
        <p className="text-[#532563]/70 mt-2">Check back soon or submit your HOT CRAP!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Playlist header */}
      <div className="bg-[#C6FF5D] border-4 border-black border-b-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[#532563]">FECE {year}</h3>
            <p className="text-[#532563]/70">{songs.length} {songs.length === 1 ? "track" : "tracks"}</p>
          </div>

          {/* Play All / Stop button */}
          <button
            onClick={playlistMode ? handleStopPlaylist : handlePlayAll}
            className="bg-[#532563] hover:bg-[#F5A6EC] text-white font-bold px-6 py-3 border-4 border-black transition-colors flex items-center gap-2"
          >
            {playlistMode ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="12" height="16" />
                </svg>
                STOP
              </>
            ) : (
              <>
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                PLAY ALL
              </>
            )}
          </button>
        </div>

        <DownloadAllButton songs={songs} year={year} />
      </div>

      {/* Scrollable playlist */}
      <div
        className="border-4 border-black overflow-y-auto"
        style={{ maxHeight: "800px" }}
      >
        <div className="divide-y-4 divide-black">
          {songs.map((song, index) => (
            <PlaylistItem
              key={song.id}
              song={song}
              index={index}
              isCurrentTrack={playlistMode && currentTrackIndex === index}
              playlistMode={playlistMode}
              onTrackEnd={() => handleTrackEnd(index)}
              setAudioRef={(el) => setAudioRef(index, el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
