import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    // Create submissions directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "audio", "submissions");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFartist = fartist.replace(/[^a-zA-Z0-9]/g, "_");
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "_");
    const ext = path.extname(audioFile.name) || ".mp3";
    const fileName = `${timestamp}_${sanitizedFartist}_${sanitizedTitle}${ext}`;

    // Save file
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        title,
        fartist,
        email: email || null,
        bio: bio || null,
        lyrics: lyrics || null,
        audioUrl: `/audio/submissions/${fileName}`,
        audioFileName: audioFile.name,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}
