import { NextResponse } from "next/server";
import { generatePresignedUploadUrl } from "@/lib/r2";

export async function POST(request: Request) {
  try {
    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName and contentType are required" },
        { status: 400 }
      );
    }

    // Sanitize filename
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

    const { uploadUrl, key, publicUrl } = await generatePresignedUploadUrl(
      sanitizedFileName,
      contentType
    );

    return NextResponse.json({ uploadUrl, key, publicUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
