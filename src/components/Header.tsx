"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#532563]/95 backdrop-blur-sm border-b-4 border-[#C6FF5D]">
      <nav className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 text-lg font-bold no-underline">
            <span className="logo-fece text-lg">FECE</span>
            <span className="logo-on text-lg">ON</span>
            <span className="logo-earth text-lg">EARTH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#years" className="text-white hover:text-[#C6FF5D] transition-colors font-bold no-underline">
              YEARS PAST
            </Link>
            <a
              href="mailto:kaya.blauvelt@gmail.com?subject=FECE ON EARTH 2025 Submission"
              className="btn-chaos lime text-sm py-2 px-4 no-underline"
            >
              SUBMIT
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t-4 border-[#C6FF5D] pt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/#years"
                className="text-white hover:text-[#C6FF5D] transition-colors font-bold text-xl no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                YEARS PAST
              </Link>
              <a
                href="mailto:kaya.blauvelt@gmail.com?subject=FECE ON EARTH 2025 Submission"
                className="btn-chaos lime text-center no-underline"
                onClick={() => setIsMenuOpen(false)}
              >
                SUBMIT YOUR SONG
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
