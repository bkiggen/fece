import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Playlist from "@/components/Playlist";

export const dynamic = "force-dynamic";

export default async function Home() {
  const years = await prisma.year.findMany({
    orderBy: { year: "desc" },
  });

  const currentYear = 2025;
  const currentYearData = await prisma.year.findUnique({
    where: { year: currentYear },
    include: {
      songs: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const currentYearSongs = currentYearData?.songs.map((song) => ({
    id: song.id.toString(),
    title: song.title,
    fartist: song.fartist,
    bio: song.bio || "",
    lyrics: song.lyrics || "",
    audioUrl: song.audioUrl,
    year: currentYear,
  })) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 tropical-bg relative overflow-hidden">
        {/* Logo - Ramshackle Collage Style */}
        <div className="logo-container mb-8">
          <h1 className="flex flex-col items-center" style={{ fontSize: 'clamp(3rem, 12vw, 8rem)', fontWeight: 800, lineHeight: 0.9 }}>
            <span className="logo-fece">FECE</span>
            <span className="logo-on">ON</span>
            <span className="logo-earth">EARTH</span>
          </h1>
          <span className="logo-year">{currentYear}</span>
        </div>

        {/* Main announcement */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="medium-text mb-8">
            <span className="highlight-yellow">SONG SUBMISSIONS are OPEN</span>{" "}
            for {currentYear} / FECE 15!!!
          </p>
          <Link href="/submit" className="btn-chaos lime no-underline">
            SUBMIT YOUR SONG
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <span className="text-4xl">&#8595;</span>
        </div>
      </section>

      {/* Current Year Playlist */}
      {currentYearSongs.length > 0 && (
        <section className="section-purple py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="big-text text-center mb-8">
              <span className="highlight-lime">LISTEN NOW</span>
            </h2>
            <Playlist songs={currentYearSongs} year={currentYear} />
            <div className="text-center mt-8">
              <Link href={`/years/${currentYear}`} className="btn-chaos pink no-underline">
                VIEW FULL {currentYear} PAGE
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* THE OBJECT Section */}
      <section className="section-pink py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="big-text mb-8 text-[#532563]">THE OBJECT</h2>
          <p className="text-2xl md:text-3xl font-bold text-[#532563] leading-relaxed">
            Record a <span className="highlight-lime">homemade holiday song</span> for your own and our enjoyment!
          </p>
        </div>
      </section>

      {/* THE DETAILS Section */}
      <section className="section-purple py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="big-text text-center mb-12">
            <span className="highlight-yellow">THE DETAILS</span>
          </h2>

          <div className="space-y-8 text-xl md:text-2xl">
            <div className="bg-white/10 border-4 border-[#C6FF5D]" style={{ padding: '18px 28px 24px 22px' }}>
              <p className="font-bold">
                <span className="highlight-lime">FORMAT:</span> MP3 or MP4 audio files
              </p>
            </div>

            <div className="bg-white/10 border-4 border-[#F5A6EC]" style={{ marginLeft: '8px', padding: '22px 20px 18px 30px' }}>
              <p className="font-bold">
                <span className="highlight-pink">INCLUDE:</span> Song title, your &quot;Fartist&quot; name, a short bio, and lyrics
              </p>
            </div>

            <div className="bg-white/10 border-4 border-[#F2FF3D]" style={{ marginLeft: '-5px', padding: '16px 26px 22px 18px' }}>
              <p className="font-bold">
                <span className="highlight-yellow">SUBMIT:</span>{" "}
                <Link href="/submit" className="underline hover:text-[#C6FF5D]">
                  Use our submission form
                </Link>
              </p>
            </div>

            <div className="bg-white/10 border-4 border-[#C6FF5D]" style={{ marginLeft: '12px', padding: '20px 24px 26px 28px' }}>
              <p className="font-bold">
                <span className="highlight-lime">DEADLINE:</span> Check back for 2025 deadline!
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/submit" className="btn-chaos lime no-underline">
              SUBMIT YOUR SONG
            </Link>
          </div>
        </div>
      </section>

      {/* SPANK YOU Section */}
      <section className="section-lime py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="big-text mb-8">SPANK YOU</h2>
          <p className="text-2xl md:text-3xl font-bold leading-relaxed">
            and <span className="highlight-pink">WELCOME TO FECE ON EARTH</span>!!!!!
          </p>
          <p className="text-2xl md:text-3xl font-bold mt-4">
            We can&apos;t wait to hear your <span className="highlight-yellow">HOT CRAP</span>!!!
          </p>
        </div>
      </section>

      {/* Years Past Section */}
      <section id="years" className="section-purple py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="big-text text-center mb-4">
            <span className="highlight-pink">YEARS PAST</span>
          </h2>
          <p className="text-center text-xl mb-12 opacity-80">
            Explore the archives of holiday musical mayhem
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {years.map((yearData) => (
              <Link key={yearData.id} href={`/years/${yearData.year}`} className="year-card chaos-hover">
                {yearData.year}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GET ON THE LIST Section */}
      <section className="section-pink py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="big-text mb-8 text-[#532563]">GET ON THE LIST</h2>
          <p className="text-xl md:text-2xl font-bold text-[#532563] mb-8">
            Get notified when the new compilation drops and submission windows open!
          </p>
          <a
            href="mailto:kaya.blauvelt@gmail.com?subject=Add me to the FECE ON EARTH mailing list"
            className="btn-chaos yellow"
          >
            JOIN THE MAILING LIST
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-purple py-12 px-4 border-t-4 border-[#C6FF5D]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center items-baseline gap-1">
            <span className="bg-[#C6FF5D] text-[#532563] text-2xl font-bold px-3 py-1">FECE</span>
            <span className="bg-[#532563] text-white text-lg font-bold px-2 py-1 border-2 border-white" style={{ marginLeft: '10px', marginTop: '-8px' }}>ON</span>
            <span className="bg-[#F5A6EC] text-[#C6FF5D] text-2xl font-bold px-3 py-1" style={{ marginLeft: '-6px' }}>EARTH</span>
          </div>
          <p className="text-lg opacity-80 mb-4">
            An annual holiday song compilation since 2011
          </p>
          <p className="opacity-60">
            Questions? Contact{" "}
            <a href="mailto:kaya.blauvelt@gmail.com" className="hover:text-[#C6FF5D]">
              kaya.blauvelt@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
