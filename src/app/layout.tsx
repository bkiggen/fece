import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FECE ON EARTH - Holiday Song Compilation",
  description: "SONG SUBMISSIONS are OPEN for 2025 / FECE 15!!! Record a homemade holiday song for your own and our enjoyment!",
  keywords: ["holiday songs", "christmas music", "comedy songs", "song compilation", "fece on earth"],
  openGraph: {
    title: "FECE ON EARTH - Holiday Song Compilation",
    description: "SONG SUBMISSIONS are OPEN for 2025 / FECE 15!!! We can't wait to hear your HOT CRAP!!!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
