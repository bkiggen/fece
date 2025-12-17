"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Song {
  id: number;
  title: string;
  fartist: string;
}

interface Year {
  id: number;
  year: number;
  description: string | null;
  songs: Song[];
}

export default function YearsPage() {
  const [years, setYears] = useState<Year[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingYear, setEditingYear] = useState<Year | null>(null);
  const [newYear, setNewYear] = useState<number | null>(null);

  useEffect(() => {
    fetchYears();
  }, []);

  async function fetchYears() {
    try {
      const response = await fetch("/api/years");
      const data = await response.json();
      setYears(data);
    } catch (error) {
      console.error("Error fetching years:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(year: Year) {
    try {
      const response = await fetch(`/api/years/${year.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: year.description }),
      });

      if (response.ok) {
        fetchYears();
        setEditingYear(null);
      }
    } catch (error) {
      console.error("Error saving:", error);
    }
  }

  async function handleAddYear() {
    if (!newYear) return;

    try {
      const response = await fetch("/api/years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: newYear, description: "" }),
      });

      if (response.ok) {
        fetchYears();
        setNewYear(null);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add year");
      }
    } catch (error) {
      console.error("Error adding year:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#532563]">
      {/* Header */}
      <header className="bg-[#F2FF3D] border-b-4 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/santa" className="text-[#532563] hover:underline font-bold">
              &larr; Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-[#532563]">YEARS</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Add New Year */}
        <div className="bg-white border-4 border-black p-6 mb-8">
          <h2 className="text-xl font-bold text-[#532563] mb-4">Add New Year</h2>
          <div className="flex gap-4">
            <input
              type="number"
              value={newYear || ""}
              onChange={(e) => setNewYear(Number(e.target.value))}
              placeholder="e.g., 2026"
              className="flex-1 p-3 border-4 border-black"
            />
            <button
              onClick={handleAddYear}
              disabled={!newYear}
              className="btn-chaos lime disabled:opacity-50"
            >
              ADD YEAR
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-white text-xl">Loading...</p>
        ) : (
          <div className="space-y-4">
            {years.map((year) => (
              <div key={year.id} className="bg-white border-4 border-black p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-bold text-[#532563]">
                        {year.year}
                      </h3>
                      <span className="px-2 py-1 text-xs font-bold bg-[#C6FF5D] border-2 border-black">
                        {year.songs.length} songs
                      </span>
                    </div>
                    {year.description && (
                      <p className="text-[#532563]/70">{year.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => setEditingYear(year)}
                    className="px-4 py-2 bg-[#532563] text-white font-bold border-2 border-black hover:bg-[#F5A6EC] hover:text-[#532563]"
                  >
                    EDIT
                  </button>
                </div>

                {/* Song List */}
                {year.songs.length > 0 && (
                  <div className="mt-4 bg-gray-100 p-4">
                    <p className="font-bold text-[#532563] mb-2">Songs:</p>
                    <ul className="space-y-1">
                      {year.songs.map((song) => (
                        <li key={song.id} className="text-[#532563]">
                          {song.title} - {song.fartist}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editingYear && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setEditingYear(null)}
        >
          <div
            className="bg-white border-4 border-black p-8 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#532563] mb-6">
              Edit {editingYear.year}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="font-bold text-[#532563] block mb-1">
                  Description
                </label>
                <textarea
                  value={editingYear.description || ""}
                  onChange={(e) =>
                    setEditingYear({ ...editingYear, description: e.target.value })
                  }
                  rows={4}
                  className="w-full p-3 border-4 border-black text-[#532563] resize-none"
                  placeholder="Description for this year..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleSave(editingYear)}
                className="btn-chaos lime flex-1"
              >
                SAVE
              </button>
              <button
                onClick={() => setEditingYear(null)}
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
