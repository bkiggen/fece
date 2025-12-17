"use client";

import { Song } from "@/data/types";
import PlaylistItem from "./PlaylistItem";
import DownloadAllButton from "./DownloadAllButton";

interface PlaylistProps {
  songs: Song[];
  year: number;
}

export default function Playlist({ songs, year }: PlaylistProps) {
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
        <div>
          <h3 className="text-2xl font-bold text-[#532563]">FECE {year}</h3>
          <p className="text-[#532563]/70">{songs.length} {songs.length === 1 ? "track" : "tracks"}</p>
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
            <PlaylistItem key={song.id} song={song} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
