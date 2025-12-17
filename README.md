# FECE ON EARTH

An annual holiday song compilation website featuring homemade, irreverent holiday songs since 2011.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The site will be available at [http://localhost:4000](http://localhost:4000).

## Adding Songs

1. Add the MP3 file to `public/audio/`
2. Edit `src/data/songs.ts` and add the song to the appropriate year:

```typescript
{
  id: "2025-song-name",
  title: "Song Title",
  fartist: "Artist Name",
  bio: "Short artist bio",
  lyrics: "Song lyrics here",
  audioUrl: "/audio/filename.mp3",
  year: 2025,
}
```

## Building for Production

```bash
npm run build
npm run start
```

## Deployment

This site is designed to be deployed on Vercel.
