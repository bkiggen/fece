import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SongCard from "@/components/SongCard";
import DownloadAllButton from "@/components/DownloadAllButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: YearPageProps) {
  const { year } = await params;
  return {
    title: `${year} - FECE ON EARTH`,
    description: `Listen to the ${year} FECE ON EARTH holiday song compilation`,
  };
}

export default async function YearPage({ params }: YearPageProps) {
  const { year: yearParam } = await params;
  const yearNum = parseInt(yearParam, 10);

  const yearData = await prisma.year.findUnique({
    where: { year: yearNum },
    include: {
      songs: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!yearData) {
    notFound();
  }

  const allYears = await prisma.year.findMany({
    orderBy: { year: "desc" },
    select: { year: true },
  });

  const yearsList = allYears.map((y) => y.year);
  const currentIndex = yearsList.indexOf(yearNum);
  const prevYear = currentIndex < yearsList.length - 1 ? yearsList[currentIndex + 1] : null;
  const nextYear = currentIndex > 0 ? yearsList[currentIndex - 1] : null;

  // Transform songs for components
  const songs = yearData.songs.map((song) => ({
    id: song.id.toString(),
    title: song.title,
    fartist: song.fartist,
    bio: song.bio || "",
    lyrics: song.lyrics || "",
    audioUrl: song.audioUrl,
    year: yearNum,
  }));

  return (
    <div className="min-h-screen bg-[#532563]">
      <Header />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/#years"
              className="text-white/70 hover:text-[#C6FF5D] transition-colors text-sm flex items-center gap-2 no-underline font-bold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              BACK TO YEARS PAST
            </Link>
          </nav>

          {/* Year Header */}
          <header className="text-center mb-12">
            <h1 className="big-text glitch-text mb-4">
              <span className="highlight-yellow">{yearNum}</span>
            </h1>
            {yearData.description && (
              <p className="text-white/80 text-xl">{yearData.description}</p>
            )}
            <p className="text-[#C6FF5D] mt-4 text-xl font-bold">
              {songs.length} {songs.length === 1 ? "SONG" : "SONGS"}
            </p>
            {songs.length > 0 && (
              <div className="mt-6">
                <DownloadAllButton songs={songs} year={yearNum} />
              </div>
            )}
          </header>

          {/* Songs List */}
          {songs.length > 0 ? (
            <div className="space-y-8">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border-4 border-black">
              <p className="text-[#532563] text-xl font-bold">
                No songs available for this year yet.
              </p>
              <p className="text-[#532563]/70 mt-2">
                Check back later or contact us if you have recordings from {yearNum}!
              </p>
            </div>
          )}

          {/* Year Navigation */}
          <nav className="mt-16 flex items-center justify-between">
            {prevYear ? (
              <Link
                href={`/years/${prevYear}`}
                className="btn-chaos pink flex items-center gap-2 no-underline"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {prevYear}
              </Link>
            ) : (
              <div />
            )}

            <Link
              href="/#years"
              className="text-white hover:text-[#C6FF5D] transition-colors font-bold no-underline"
            >
              ALL YEARS
            </Link>

            {nextYear ? (
              <Link
                href={`/years/${nextYear}`}
                className="btn-chaos lime flex items-center gap-2 no-underline"
              >
                {nextYear}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t-4 border-[#C6FF5D] text-center">
        <div className="mb-4">
          <span className="logo-fece text-xl">FECE</span>{" "}
          <span className="logo-on text-xl">ON</span>{" "}
          <span className="logo-earth text-xl">EARTH</span>
        </div>
        <p className="opacity-60">
          <a href="mailto:kaya.blauvelt@gmail.com" className="hover:text-[#C6FF5D]">
            kaya.blauvelt@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
