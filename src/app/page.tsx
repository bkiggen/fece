import Link from "next/link";
import { getAllYears, getYearData } from "@/data/songs";
import Playlist from "@/components/Playlist";

export default function Home() {
  const years = getAllYears();
  const currentYear = 2025;
  const currentYearData = getYearData(currentYear);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 tropical-bg relative overflow-hidden">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="big-text glitch-text mb-4">
            <span className="logo-fece">FECE</span>{" "}
            <span className="logo-on">ON</span>{" "}
            <span className="logo-earth">EARTH</span>
          </h1>
        </div>

        {/* Main announcement */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="medium-text mb-8">
            <span className="highlight-yellow">SONG SUBMISSIONS are OPEN</span>{" "}
            for 2025 / FECE 15!!!
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <span className="text-4xl">&#8595;</span>
        </div>
      </section>

      {/* Current Year Playlist */}
      {currentYearData && (
        <section className="section-purple py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="big-text text-center mb-8">
              <span className="highlight-lime">LISTEN NOW</span>
            </h2>
            <Playlist songs={currentYearData.songs} year={currentYear} />
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
            <div className="bg-white/10 p-6 border-4 border-[#C6FF5D]">
              <p className="font-bold">
                <span className="highlight-lime">FORMAT:</span> MP3 or MP4 audio files
              </p>
            </div>

            <div className="bg-white/10 p-6 border-4 border-[#F5A6EC]">
              <p className="font-bold">
                <span className="highlight-pink">INCLUDE:</span> Song title, your &quot;Fartist&quot; name, a short bio, and lyrics
              </p>
            </div>

            <div className="bg-white/10 p-6 border-4 border-[#F2FF3D]">
              <p className="font-bold">
                <span className="highlight-yellow">SEND TO:</span>{" "}
                <a href="mailto:kaya.blauvelt@gmail.com" className="underline hover:text-[#C6FF5D]">
                  kaya.blauvelt@gmail.com
                </a>
              </p>
            </div>

            <div className="bg-white/10 p-6 border-4 border-[#C6FF5D]">
              <p className="font-bold">
                <span className="highlight-lime">DEADLINE:</span> Check back for 2025 deadline!
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <a
              href="mailto:kaya.blauvelt@gmail.com?subject=FECE ON EARTH 2025 Submission"
              className="btn-chaos lime"
            >
              SUBMIT YOUR SONG
            </a>
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
            {years.map((year) => (
              <Link key={year} href={`/years/${year}`} className="year-card chaos-hover">
                {year}
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
          <div className="mb-6">
            <span className="logo-fece text-2xl">FECE</span>{" "}
            <span className="logo-on text-2xl">ON</span>{" "}
            <span className="logo-earth text-2xl">EARTH</span>
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
