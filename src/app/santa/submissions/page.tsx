"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Submission {
  id: number;
  title: string;
  fartist: string;
  email: string | null;
  bio: string | null;
  lyrics: string | null;
  audioUrl: string;
  audioFileName: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  targetYear: number | null;
  createdAt: string;
}

interface Year {
  id: number;
  year: number;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [subRes, yearsRes] = await Promise.all([
        fetch("/api/submissions"),
        fetch("/api/years"),
      ]);
      const subs = await subRes.json();
      const yrs = await yearsRes.json();
      setSubmissions(subs);
      setYears(yrs);
      if (yrs.length > 0) {
        setSelectedYearId(yrs[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(submission: Submission) {
    if (!selectedYearId) {
      alert("Please select a year");
      return;
    }

    try {
      const response = await fetch(`/api/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED", yearId: selectedYearId }),
      });

      if (response.ok) {
        fetchData();
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error("Error approving:", error);
    }
  }

  async function handleReject(id: number) {
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (response.ok) {
        fetchData();
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error("Error rejecting:", error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === "ALL") return true;
    return s.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#532563]">
      {/* Header */}
      <header className="bg-[#F5A6EC] border-b-4 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/santa" className="text-[#532563] hover:underline font-bold">
              &larr; Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-[#532563]">SUBMISSIONS</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(["PENDING", "APPROVED", "REJECTED", "ALL"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-bold border-2 border-black ${
                filter === f
                  ? "bg-[#C6FF5D] text-[#532563]"
                  : "bg-white text-[#532563] hover:bg-gray-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-white text-xl">Loading...</p>
        ) : filteredSubmissions.length === 0 ? (
          <div className="bg-white border-4 border-black p-8 text-center">
            <p className="text-[#532563] text-xl">No {filter.toLowerCase()} submissions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white border-4 border-black p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#532563]">
                        {submission.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-bold border-2 border-black ${
                          submission.status === "PENDING"
                            ? "bg-[#F2FF3D]"
                            : submission.status === "APPROVED"
                            ? "bg-[#C6FF5D]"
                            : "bg-red-300"
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                    <p className="text-[#532563]">
                      by <span className="font-bold">{submission.fartist}</span>
                    </p>
                    {submission.email && (
                      <p className="text-[#532563]/60 text-sm">{submission.email}</p>
                    )}
                    <p className="text-[#532563]/60 text-sm mt-1">
                      Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="px-4 py-2 bg-[#532563] text-white font-bold border-2 border-black hover:bg-[#F5A6EC] hover:text-[#532563]"
                    >
                      REVIEW
                    </button>
                  </div>
                </div>

                {/* Audio Player */}
                <div className="mt-4">
                  <audio controls className="w-full" src={submission.audioUrl}>
                    Your browser does not support audio.
                  </audio>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Review Modal */}
      {selectedSubmission && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="bg-white border-4 border-black p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-[#532563] mb-4">
              Review Submission
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="font-bold text-[#532563]">Title</label>
                <p className="text-lg text-[#532563]">{selectedSubmission.title}</p>
              </div>
              <div>
                <label className="font-bold text-[#532563]">Fartist</label>
                <p className="text-lg text-[#532563]">{selectedSubmission.fartist}</p>
              </div>
              {selectedSubmission.email && (
                <div>
                  <label className="font-bold text-[#532563]">Email</label>
                  <p className="text-[#532563]">{selectedSubmission.email}</p>
                </div>
              )}
              {selectedSubmission.bio && (
                <div>
                  <label className="font-bold text-[#532563]">Bio</label>
                  <p className="whitespace-pre-wrap text-[#532563]">{selectedSubmission.bio}</p>
                </div>
              )}
              {selectedSubmission.lyrics && (
                <div>
                  <label className="font-bold text-[#532563]">Lyrics</label>
                  <pre className="whitespace-pre-wrap bg-gray-100 p-4 mt-1 text-sm text-[#532563]">
                    {selectedSubmission.lyrics}
                  </pre>
                </div>
              )}
              <div>
                <label className="font-bold text-[#532563]">Audio</label>
                <audio controls className="w-full mt-1" src={selectedSubmission.audioUrl}>
                  Your browser does not support audio.
                </audio>
              </div>
            </div>

            {selectedSubmission.status === "PENDING" && (
              <div className="mb-6">
                <label className="font-bold text-[#532563] block mb-2">
                  Approve to Year:
                </label>
                <select
                  value={selectedYearId || ""}
                  onChange={(e) => setSelectedYearId(Number(e.target.value))}
                  className="w-full p-3 border-4 border-black text-[#532563]"
                >
                  {years.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-4">
              {selectedSubmission.status === "PENDING" && (
                <>
                  <button
                    onClick={() => handleApprove(selectedSubmission)}
                    className="btn-chaos lime flex-1"
                  >
                    APPROVE
                  </button>
                  <button
                    onClick={() => handleReject(selectedSubmission.id)}
                    className="bg-red-500 text-white font-bold py-4 px-6 border-4 border-black flex-1 hover:bg-red-600"
                  >
                    REJECT
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(selectedSubmission.id)}
                className="bg-gray-500 text-white font-bold py-4 px-6 border-4 border-black hover:bg-gray-600"
              >
                DELETE
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="bg-white text-[#532563] font-bold py-4 px-6 border-4 border-black hover:bg-gray-100"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
