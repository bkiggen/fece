"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Song } from "@/data/types";

interface DownloadAllButtonProps {
  songs: Song[];
  year: number;
}

export default function DownloadAllButton({ songs, year }: DownloadAllButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadAll = async () => {
    if (songs.length === 0) return;

    setIsDownloading(true);
    setProgress(0);

    try {
      const zip = new JSZip();

      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const fileName = `${song.fartist} - ${song.title}.mp3`;

        const response = await fetch(song.audioUrl);
        const blob = await response.blob();
        zip.file(fileName, blob);

        setProgress(Math.round(((i + 1) / songs.length) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `FECE-ON-EARTH-${year}.zip`);
    } catch (error) {
      console.error("Error creating zip:", error);
      alert("Error downloading songs. Please try again.");
    } finally {
      setIsDownloading(false);
      setProgress(0);
    }
  };

  if (songs.length === 0) return null;

  return (
    <button
      onClick={downloadAll}
      disabled={isDownloading}
      className="btn-chaos yellow flex items-center gap-3 no-underline disabled:opacity-70"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {isDownloading ? `DOWNLOADING... ${progress}%` : `DOWNLOAD ALL ${songs.length} SONGS`}
    </button>
  );
}
