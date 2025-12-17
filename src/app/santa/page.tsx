"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  pendingSubmissions: number;
  totalSongs: number;
  totalYears: number;
}

export default function SantaDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [submissionsRes, songsRes, yearsRes] = await Promise.all([
          fetch("/api/submissions"),
          fetch("/api/songs"),
          fetch("/api/years"),
        ]);

        const submissions = await submissionsRes.json();
        const songs = await songsRes.json();
        const years = await yearsRes.json();

        setStats({
          pendingSubmissions: submissions.filter(
            (s: { status: string }) => s.status === "PENDING"
          ).length,
          totalSongs: songs.length,
          totalYears: years.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#532563]">
      {/* Header */}
      <header className="bg-[#C6FF5D] border-b-4 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#532563]">
            THE FART FACTORY
          </h1>
          <Link href="/" className="text-[#532563] hover:underline font-bold">
            View Site &rarr;
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/santa/submissions"
            className="bg-[#F5A6EC] border-4 border-black p-6 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_black] transition-all no-underline"
          >
            <h2 className="text-lg font-bold text-[#532563] mb-2">
              PENDING SUBMISSIONS
            </h2>
            <p className="text-5xl font-bold text-[#532563]">
              {stats?.pendingSubmissions ?? "..."}
            </p>
          </Link>

          <Link
            href="/santa/songs"
            className="bg-[#C6FF5D] border-4 border-black p-6 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_black] transition-all no-underline"
          >
            <h2 className="text-lg font-bold text-[#532563] mb-2">
              TOTAL SONGS
            </h2>
            <p className="text-5xl font-bold text-[#532563]">
              {stats?.totalSongs ?? "..."}
            </p>
          </Link>

          <Link
            href="/santa/years"
            className="bg-[#F2FF3D] border-4 border-black p-6 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_black] transition-all no-underline"
          >
            <h2 className="text-lg font-bold text-[#532563] mb-2">YEARS</h2>
            <p className="text-5xl font-bold text-[#532563]">
              {stats?.totalYears ?? "..."}
            </p>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white border-4 border-black p-8">
          <h2 className="text-2xl font-bold text-[#532563] mb-6">
            QUICK ACTIONS
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/santa/submissions"
              className="btn-chaos pink text-center no-underline"
            >
              REVIEW SUBMISSIONS
            </Link>
            <Link
              href="/santa/songs"
              className="btn-chaos lime text-center no-underline"
            >
              MANAGE SONGS
            </Link>
            <Link
              href="/santa/years"
              className="btn-chaos yellow text-center no-underline"
            >
              MANAGE YEARS
            </Link>
            <Link
              href="/submit"
              className="bg-white text-[#532563] font-bold py-4 px-6 border-4 border-black text-center no-underline hover:bg-gray-100"
            >
              VIEW SUBMIT FORM
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
