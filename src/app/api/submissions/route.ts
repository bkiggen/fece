import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToR2 } from "@/lib/r2";

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
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const fartist = formData.get("fartist") as string;
    const email = formData.get("email") as string | null;
    const bio = formData.get("bio") as string | null;
    const lyrics = formData.get("lyrics") as string | null;
    const audioFile = formData.get("audio") as File | null;

    if (!title || !fartist || !audioFile) {
      return NextResponse.json(
        { error: "Title, fartist, and audio file are required" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const sanitizedFartist = fartist.replace(/[^a-zA-Z0-9]/g, "_");
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
    const ext = audioFile.name.split('.').pop() || "mp3";
    const fileName = `${sanitizedFartist}_${sanitizedTitle}.${ext}`;

    // Upload to R2
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const audioUrl = await uploadToR2(buffer, fileName, audioFile.type || "audio/mpeg");

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        title,
        fartist,
        email: email || null,
        bio: bio || null,
        lyrics: lyrics || null,
        audioUrl,
        audioFileName: audioFile.name,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}
