"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Year {
  id: number;
  year: number;
}

interface Song {
  id: number;
  title: string;
  fartist: string;
  bio: string | null;
  lyrics: string | null;
  audioUrl: string;
  yearId: number;
  year: Year;
  createdAt: string;
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [filterYear, setFilterYear] = useState<number | "ALL">("ALL");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [songsRes, yearsRes] = await Promise.all([
        fetch("/api/songs"),
        fetch("/api/years"),
      ]);
      const songsData = await songsRes.json();
      const yearsData = await yearsRes.json();
      setSongs(songsData);
      setYears(yearsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(song: Song) {
    try {
      const response = await fetch(`/api/songs/${song.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: song.title,
          fartist: song.fartist,
          bio: song.bio,
          lyrics: song.lyrics,
          yearId: song.yearId,
        }),
      });

      if (response.ok) {
        fetchData();
        setEditingSong(null);
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      const response = await fetch(`/api/songs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
        setEditingSong(null);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }

  const filteredSongs = songs.filter((s) => {
    if (filterYear === "ALL") return true;
    return s.year.year === filterYear;
  });

  return (
    <div className="min-h-screen bg-[#532563]">
      {/* Header */}
      <header className="bg-[#C6FF5D] border-b-4 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/santa" className="text-[#532563] hover:underline font-bold">
              &larr; Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-[#532563]">SONGS</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilterYear("ALL")}
            className={`px-4 py-2 font-bold border-2 border-black ${
              filterYear === "ALL"
                ? "bg-[#C6FF5D] text-[#532563]"
                : "bg-white text-[#532563] hover:bg-gray-100"
            }`}
          >
            ALL
          </button>
          {years.map((year) => (
            <button
              key={year.id}
              onClick={() => setFilterYear(year.year)}
              className={`px-4 py-2 font-bold border-2 border-black ${
                filterYear === year.year
                  ? "bg-[#C6FF5D] text-[#532563]"
                  : "bg-white text-[#532563] hover:bg-gray-100"
              }`}
            >
              {year.year}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-white text-xl">Loading...</p>
        ) : filteredSongs.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="text-[#532563] text-xl">No songs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSongs.map((song) => (
              <div key={song.id} className="bg-white border-4 border-black p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#532563]">
                        {song.title}
                      </h3>
                      <span className="px-2 py-1 text-xs font-bold bg-[#F2FF3D] border-2 border-black">
                        {song.year.year}
                      </span>
                    </div>
                    <p className="text-[#532563]">
                      by <span className="font-bold">{song.fartist}</span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSong(song)}
                      className="px-4 py-2 bg-[#532563] text-white font-bold border-2 border-black hover:bg-[#F5A6EC] hover:text-[#532563]"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(song.id)}
                      className="px-4 py-2 bg-red-500 text-white font-bold border-2 border-black hover:bg-red-600"
                    >
                      DELETE
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <audio controls className="w-full" src={song.audioUrl}>
                    Your browser does not support audio.
                  </audio>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingSong && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setEditingSong(null)}
        >
          <div
            className="bg-white border-4 border-black p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#532563] mb-6">Edit Song</h2>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-[#532563] block mb-1">Title</label>
                <input
                  type="text"
                  value={editingSong.title}
                  onChange={(e) =>
                    setEditingSong({ ...editingSong, title: e.target.value })
                  }
                  className="w-full p-3 border-4 border-black text-[#532563]"
                />
              </div>

              <div>
                <label className="font-bold text-[#532563] block mb-1">Fartist</label>
                <input
                  type="text"
                  value={editingSong.fartist}
                  onChange={(e) =>
                    setEditingSong({ ...editingSong, fartist: e.target.value })
                  }
                  className="w-full p-3 border-4 border-black text-[#532563]"
                />
              </div>

              <div>
                <label className="font-bold text-[#532563] block mb-1">Year</label>
                <select
                  value={editingSong.yearId}
                  onChange={(e) =>
                    setEditingSong({ ...editingSong, yearId: Number(e.target.value) })
                  }
                  className="w-full p-3 border-4 border-black text-[#532563]"
                >
                  {years.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#532563] block mb-1">Bio</label>
                <textarea
                  value={editingSong.bio || ""}
                  onChange={(e) =>
                    setEditingSong({ ...editingSong, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 border-4 border-black text-[#532563] resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#532563] block mb-1">Lyrics</label>
                <textarea
                  value={editingSong.lyrics || ""}
                  onChange={(e) =>
                    setEditingSong({ ...editingSong, lyrics: e.target.value })
                  }
                  rows={8}
                  className="w-full p-3 border-4 border-black text-[#532563] font-mono text-sm resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#532563] block mb-1">Audio</label>
                <audio controls className="w-full" src={editingSong.audioUrl}>
                  Your browser does not support audio.
                </audio>
                <p className="text-sm text-gray-500 mt-1">{editingSong.audioUrl}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleSave(editingSong)}
                className="btn-chaos lime flex-1"
              >
                SAVE
              </button>
              <button
                onClick={() => setEditingSong(null)}
                className="bg-white text-[#532563] font-bold py-4 px-6 border-4 border-black hover:bg-gray-100 flex-1"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
