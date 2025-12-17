import { YearData } from './types';

// Sample data structure - replace with actual song data
// Audio URLs should point to your Cloudflare R2 bucket
// Example: https://your-bucket.r2.cloudflarestorage.com/2024/song-name.mp3

export const allYears: YearData[] = [
  {
    year: 2025,
    description: "The latest and greatest holiday hits!",
    songs: [
      {
        id: "2025-frosty-twinkle",
        title: "Frosty Twinkle",
        fartist: "Saint Mary of Puddle",
        bio: "",
        lyrics: "",
        audioUrl: "/audio/Saint Mary of Puddle - Frosty Twinkle.mp3",
        year: 2025,
      },
      {
        id: "2025-diarrhea-for-christmas",
        title: "Diarrhea For Christmas",
        fartist: "DJ Yule",
        bio: "",
        lyrics: "",
        audioUrl: "/audio/DJ Yule - Diarrhea For Christmas.mp3",
        year: 2025,
      },
    ],
  },
  {
    year: 2024,
    description: "Another year of holiday magic!",
    songs: [
      {
        id: "2024-sample-1",
        title: "Sample Song 2024",
        fartist: "Example Fartist",
        bio: "This is a placeholder bio. Replace with actual artist bio.",
        lyrics: "These are placeholder lyrics.\nReplace with actual song lyrics.",
        audioUrl: "/audio/sample.mp3",
        year: 2024,
      },
    ],
  },
  {
    year: 2023,
    description: "",
    songs: [],
  },
  {
    year: 2022,
    description: "",
    songs: [],
  },
  {
    year: 2021,
    description: "",
    songs: [],
  },
  {
    year: 2020,
    description: "",
    songs: [],
  },
  {
    year: 2019,
    description: "",
    songs: [],
  },
  {
    year: 2018,
    description: "",
    songs: [],
  },
  {
    year: 2017,
    description: "",
    songs: [],
  },
  {
    year: 2016,
    description: "",
    songs: [],
  },
  {
    year: 2015,
    description: "",
    songs: [],
  },
  {
    year: 2014,
    description: "",
    songs: [],
  },
  {
    year: 2013,
    description: "",
    songs: [],
  },
  {
    year: 2012,
    description: "",
    songs: [],
  },
  {
    year: 2011,
    description: "Where it all began...",
    songs: [],
  },
];

export function getYearData(year: number): YearData | undefined {
  return allYears.find((y) => y.year === year);
}

export function getAllYears(): number[] {
  return allYears.map((y) => y.year).sort((a, b) => b - a);
}
