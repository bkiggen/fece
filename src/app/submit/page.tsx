"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setUploadProgress("Preparing upload...");

    const formData = new FormData(e.currentTarget);
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      setError("Please select an audio file");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Get presigned upload URL
      setUploadProgress("Getting upload URL...");
      const urlResponse = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: audioFile.name,
          contentType: audioFile.type || "audio/mpeg",
        }),
      });

      if (!urlResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, publicUrl } = await urlResponse.json();

      // Step 2: Upload file directly to R2
      setUploadProgress("Uploading audio file...");
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: audioFile,
        headers: {
          "Content-Type": audioFile.type || "audio/mpeg",
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload audio file");
      }

      // Step 3: Submit form data with audio URL
      setUploadProgress("Saving submission...");
      const submissionResponse = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          fartist: formData.get("fartist"),
          email: formData.get("email") || null,
          bio: formData.get("bio") || null,
          lyrics: formData.get("lyrics") || null,
          audioUrl: publicUrl,
          audioFileName: audioFile.name,
        }),
      });

      if (!submissionResponse.ok) {
        const data = await submissionResponse.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#532563]">
        <Header />
        <main className="pt-24 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-[#C6FF5D] border-4 border-black p-12">
              <h1 className="text-4xl font-bold text-[#532563] mb-6">
                HOT CRAP RECEIVED!!!
              </h1>
              <p className="text-xl text-[#532563] mb-8">
                Santa will review your submission and add it to the compilation if it makes the cut.
              </p>
              <Link href="/" className="btn-chaos pink no-underline">
                BACK TO HOME
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#532563]">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="big-text text-center mb-4">
            <span className="highlight-yellow">SUBMIT YOUR SONG</span>
          </h1>
          <p className="text-center text-xl mb-8 opacity-80">
            Upload your HOT CRAP for Santa to review!
          </p>

          <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-8">
            {error && (
              <div className="bg-red-500 text-white p-4 mb-6 border-2 border-black">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Song Title */}
              <div>
                <label htmlFor="title" className="block text-[#532563] font-bold text-lg mb-2">
                  SONG TITLE *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full p-3 border-4 border-black text-[#532563] text-lg"
                  placeholder="e.g., Jingle Smells"
                />
              </div>

              {/* Fartist Name */}
              <div>
                <label htmlFor="fartist" className="block text-[#532563] font-bold text-lg mb-2">
                  FARTIST NAME *
                </label>
                <input
                  type="text"
                  id="fartist"
                  name="fartist"
                  required
                  className="w-full p-3 border-4 border-black text-[#532563] text-lg"
                  placeholder="e.g., DJ Poopypants"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[#532563] font-bold text-lg mb-2">
                  EMAIL (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 border-4 border-black text-[#532563] text-lg"
                  placeholder="your@email.com"
                />
                <p className="text-sm text-[#532563]/60 mt-1">
                  So Santa can contact you if needed
                </p>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-[#532563] font-bold text-lg mb-2">
                  FARTIST BIO (optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  className="w-full p-3 border-4 border-black text-[#532563] text-lg resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Lyrics */}
              <div>
                <label htmlFor="lyrics" className="block text-[#532563] font-bold text-lg mb-2">
                  LYRICS (optional but encouraged!)
                </label>
                <textarea
                  id="lyrics"
                  name="lyrics"
                  rows={6}
                  className="w-full p-3 border-4 border-black text-[#532563] text-lg font-mono resize-none"
                  placeholder="Verse 1:&#10;Your lyrics here...&#10;&#10;Chorus:&#10;..."
                />
              </div>

              {/* Audio File */}
              <div>
                <label htmlFor="audio" className="block text-[#532563] font-bold text-lg mb-2">
                  AUDIO FILE * (MP3 or MP4)
                </label>
                <input
                  type="file"
                  id="audio"
                  name="audio"
                  accept="audio/*,.mp3,.mp4,.m4a,.wav"
                  required
                  className="w-full p-3 border-4 border-black text-[#532563] text-lg bg-[#F2FF3D]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-chaos lime w-full text-center disabled:opacity-50"
                >
                  {isSubmitting ? uploadProgress.toUpperCase() || "UPLOADING HOT CRAP..." : "SUBMIT YOUR HOT CRAP"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-white hover:text-[#C6FF5D] no-underline font-bold">
              &larr; BACK TO HOME
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
