import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create years 2011-2025
  const years = [
    { year: 2025, description: "The latest and greatest holiday hits!" },
    { year: 2024, description: "Another year of holiday magic!" },
    { year: 2023, description: "" },
    { year: 2022, description: "" },
    { year: 2021, description: "" },
    { year: 2020, description: "" },
    { year: 2019, description: "" },
    { year: 2018, description: "" },
    { year: 2017, description: "" },
    { year: 2016, description: "" },
    { year: 2015, description: "" },
    { year: 2014, description: "" },
    { year: 2013, description: "" },
    { year: 2012, description: "" },
    { year: 2011, description: "Where it all began..." },
  ];

  for (const yearData of years) {
    await prisma.year.upsert({
      where: { year: yearData.year },
      update: { description: yearData.description },
      create: yearData,
    });
  }

  console.log("Years seeded!");

  // Get the 2025 year for songs
  const year2025 = await prisma.year.findUnique({ where: { year: 2025 } });

  if (year2025) {
    // Seed existing songs
    const songs = [
      {
        title: "Frosty Twinkle",
        fartist: "Saint Mary of Puddle",
        bio: "",
        lyrics: "",
        audioUrl: "/audio/Saint Mary of Puddle - Frosty Twinkle.mp3",
        yearId: year2025.id,
      },
      {
        title: "Diarrhea For Christmas",
        fartist: "DJ Yule",
        bio: "",
        lyrics: "",
        audioUrl: "/audio/DJ Yule - Diarrhea For Christmas.mp3",
        yearId: year2025.id,
      },
    ];

    for (const song of songs) {
      const existing = await prisma.song.findFirst({
        where: { title: song.title, fartist: song.fartist },
      });

      if (!existing) {
        await prisma.song.create({ data: song });
      }
    }

    console.log("Songs seeded!");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
