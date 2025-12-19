import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { title, fartist, email, bio, lyrics, audioUrl, audioFileName } = data;

    if (!title || !fartist || !audioUrl) {
      return NextResponse.json(
        { error: "Title, fartist, and audioUrl are required" },
        { status: 400 }
      );
    }

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        title,
        fartist,
        email: email || null,
        bio: bio || null,
        lyrics: lyrics || null,
        audioUrl,
        audioFileName: audioFileName || "audio.mp3",
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}
