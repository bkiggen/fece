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
  const [shuffleMode, setShuffleMode] = useState(false);
  const [playedIndices, setPlayedIndices] = useState<Set<number>>(new Set());
  const playlistRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    playlistRefs.current = playlistRefs.current.slice(0, songs.length);
  }, [songs.length]);

  const getRandomUnplayedIndex = (exclude: Set<number>): number | null => {
    const unplayed = songs
      .map((_, i) => i)
      .filter(i => !exclude.has(i));

    if (unplayed.length === 0) return null;

    return unplayed[Math.floor(Math.random() * unplayed.length)];
  };

  const handlePlayAll = () => {
    if (songs.length === 0) return;

    // Pause all audio first
    playlistRefs.current.forEach(audio => audio?.pause());

    setPlaylistMode(true);

    let startIndex: number;
    if (shuffleMode) {
      startIndex = Math.floor(Math.random() * songs.length);
      setPlayedIndices(new Set([startIndex]));
    } else {
      startIndex = 0;
      setPlayedIndices(new Set());
    }

    setCurrentTrackIndex(startIndex);

    // Start playing first track
    setTimeout(() => {
      playlistRefs.current[startIndex]?.play();
    }, 100);
  };

  const handleStopPlaylist = () => {
    setPlaylistMode(false);
    setCurrentTrackIndex(null);
    setPlayedIndices(new Set());
    playlistRefs.current.forEach(audio => audio?.pause());
  };

  const handleTrackEnd = (index: number) => {
    if (!playlistMode) return;

    let nextIndex: number | null;

    if (shuffleMode) {
      // Get random unplayed track
      const newPlayedIndices = new Set(playedIndices);
      newPlayedIndices.add(index);
      nextIndex = getRandomUnplayedIndex(newPlayedIndices);

      if (nextIndex !== null) {
        setPlayedIndices(newPlayedIndices);
        setCurrentTrackIndex(nextIndex);
        setTimeout(() => {
          playlistRefs.current[nextIndex!]?.play();
        }, 100);
      } else {
        // All tracks played
        setPlaylistMode(false);
        setCurrentTrackIndex(null);
        setPlayedIndices(new Set());
      }
    } else {
      // Sequential playback
      nextIndex = index + 1;
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
    }
  };

  const toggleShuffle = () => {
    setShuffleMode(!shuffleMode);
    // If playlist is active, reset it
    if (playlistMode) {
      handleStopPlaylist();
    }
  };

  const handleNextTrack = () => {
    if (!playlistMode || currentTrackIndex === null) return;

    // Pause current track
    playlistRefs.current[currentTrackIndex]?.pause();

    if (shuffleMode) {
      const newPlayedIndices = new Set(playedIndices);
      newPlayedIndices.add(currentTrackIndex);
      const nextIndex = getRandomUnplayedIndex(newPlayedIndices);

      if (nextIndex !== null) {
        setPlayedIndices(newPlayedIndices);
        setCurrentTrackIndex(nextIndex);
        setTimeout(() => {
          playlistRefs.current[nextIndex]?.play();
        }, 100);
      } else {
        // All tracks played
        handleStopPlaylist();
      }
    } else {
      const nextIndex = currentTrackIndex + 1;
      if (nextIndex < songs.length) {
        setCurrentTrackIndex(nextIndex);
        setTimeout(() => {
          playlistRefs.current[nextIndex]?.play();
        }, 100);
      } else {
        // End of playlist
        handleStopPlaylist();
      }
    }
  };

  const handlePreviousTrack = () => {
    if (!playlistMode || currentTrackIndex === null) return;

    // Pause current track
    playlistRefs.current[currentTrackIndex]?.pause();

    const prevIndex = currentTrackIndex - 1;
    if (prevIndex >= 0) {
      setCurrentTrackIndex(prevIndex);
      // In shuffle mode, remove from played indices to allow replay
      if (shuffleMode) {
        const newPlayedIndices = new Set(playedIndices);
        newPlayedIndices.delete(prevIndex);
        setPlayedIndices(newPlayedIndices);
      }
      setTimeout(() => {
        playlistRefs.current[prevIndex]?.play();
      }, 100);
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
      <div className="bg-[#C6FF5D] border-4 border-black border-b-0 p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h3 className="text-2xl font-bold text-[#532563]">FECE {year}</h3>
            <p className="text-[#532563]/70">{songs.length} {songs.length === 1 ? "track" : "tracks"}</p>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            {/* Shuffle button */}
            <button
              onClick={toggleShuffle}
              className={`w-12 h-12 border-4 border-black transition-colors flex items-center justify-center ${
                shuffleMode
                  ? 'bg-[#F5A6EC] hover:bg-[#F5A6EC]/80 text-[#532563]'
                  : 'bg-white hover:bg-[#F2FF3D] text-[#532563]'
              }`}
              title="Shuffle"
              aria-label="Toggle shuffle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-9 4 18 3-9h4M17 8l4 4-4 4M3 16h4l3-9 4 18 3-9h4" />
              </svg>
            </button>

            {/* Previous track button */}
            <button
              onClick={handlePreviousTrack}
              disabled={!playlistMode || currentTrackIndex === null || currentTrackIndex === 0}
              className="w-12 h-12 bg-white hover:bg-[#F2FF3D] disabled:opacity-30 disabled:hover:bg-white text-[#532563] border-4 border-black transition-colors flex items-center justify-center"
              title="Previous track"
              aria-label="Previous track"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            {/* Play/Stop button */}
            <button
              onClick={playlistMode ? handleStopPlaylist : handlePlayAll}
              className="w-14 h-14 bg-[#532563] hover:bg-[#F5A6EC] text-white border-4 border-black transition-colors flex items-center justify-center"
              title={playlistMode ? "Stop" : "Play all"}
              aria-label={playlistMode ? "Stop playlist" : "Play all"}
            >
              {playlistMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Next track button */}
            <button
              onClick={handleNextTrack}
              disabled={!playlistMode || currentTrackIndex === null}
              className="w-12 h-12 bg-white hover:bg-[#F2FF3D] disabled:opacity-30 disabled:hover:bg-white text-[#532563] border-4 border-black transition-colors flex items-center justify-center"
              title="Next track"
              aria-label="Next track"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
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
