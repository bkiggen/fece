export interface Song {
  id: string;
  title: string;
  fartist: string; // Artist name
  bio: string;
  lyrics: string;
  audioUrl: string;
  year: number;
}

export interface YearData {
  year: number;
  description?: string;
  songs: Song[];
}
