import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromR2 } from "@/lib/r2";

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

    // If approving, create a song (audio stays in R2)
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

      // Create the song using the existing R2 URL
      await prisma.song.create({
        data: {
          title: submission.title,
          fartist: submission.fartist,
          bio: submission.bio || "",
          lyrics: submission.lyrics || "",
          audioUrl: submission.audioUrl,
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

    // Delete the audio file from R2
    try {
      await deleteFromR2(submission.audioUrl);
    } catch {
      console.log("Could not delete audio file from R2");
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
