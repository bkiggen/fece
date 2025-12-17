export default function Footer() {
  return (
    <footer className="bg-fece-dark border-t border-fece-green/20 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-fece-cream font-display font-bold text-lg">
              FECE ON EARTH
            </p>
            <p className="text-fece-cream/60 text-sm mt-1">
              Spreading holiday cheer, one turd at a time.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="mailto:kaya.blauvelt@gmail.com"
              className="text-fece-cream/60 hover:text-fece-gold transition-colors text-sm"
            >
              Contact
            </a>
            <span className="text-fece-cream/30">|</span>
            <p className="text-fece-cream/60 text-sm">
              &copy; {new Date().getFullYear()} Fece On Earth
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
