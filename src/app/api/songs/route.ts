import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      include: { year: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const song = await prisma.song.create({
      data: {
        title: body.title,
        fartist: body.fartist,
        bio: body.bio || "",
        lyrics: body.lyrics || "",
        audioUrl: body.audioUrl,
        yearId: body.yearId,
      },
      include: { year: true },
    });
    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    console.error("Error creating song:", error);
    return NextResponse.json({ error: "Failed to create song" }, { status: 500 });
  }
}
