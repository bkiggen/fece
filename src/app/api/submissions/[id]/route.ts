import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink, rename, mkdir } from "fs/promises";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await prisma.submission.findUnique({
      where: { id: parseInt(id) },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // If approving, create a song and move the audio file
    if (body.status === "APPROVED" && body.yearId) {
      const submission = await prisma.submission.findUnique({
        where: { id: parseInt(id) },
      });

      if (!submission) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 });
      }

      // Get the year info
      const year = await prisma.year.findUnique({
        where: { id: body.yearId },
      });

      if (!year) {
        return NextResponse.json({ error: "Year not found" }, { status: 404 });
      }

      // Move audio file from submissions to main audio folder
      const oldPath = path.join(process.cwd(), "public", submission.audioUrl);
      const newFileName = `${submission.fartist} - ${submission.title}.mp3`;
      const newDir = path.join(process.cwd(), "public", "audio");
      await mkdir(newDir, { recursive: true });
      const newPath = path.join(newDir, newFileName);
      const newAudioUrl = `/audio/${newFileName}`;

      try {
        await rename(oldPath, newPath);
      } catch {
        // If rename fails (cross-device), the file might already be in place
        console.log("Could not move file, using original path");
      }

      // Create the song
      await prisma.song.create({
        data: {
          title: submission.title,
          fartist: submission.fartist,
          bio: submission.bio || "",
          lyrics: submission.lyrics || "",
          audioUrl: newAudioUrl,
          yearId: body.yearId,
        },
      });

      // Update submission status
      const updated = await prisma.submission.update({
        where: { id: parseInt(id) },
        data: {
          status: "APPROVED",
          targetYear: year.year,
        },
      });

      return NextResponse.json(updated);
    }

    // For rejection or other updates
    const updated = await prisma.submission.update({
      where: { id: parseInt(id) },
      data: {
        status: body.status,
        title: body.title,
        fartist: body.fartist,
        bio: body.bio,
        lyrics: body.lyrics,
        email: body.email,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await prisma.submission.findUnique({
      where: { id: parseInt(id) },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Delete the audio file
    try {
      const filePath = path.join(process.cwd(), "public", submission.audioUrl);
      await unlink(filePath);
    } catch {
      console.log("Could not delete audio file");
    }

    // Delete the submission
    await prisma.submission.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
