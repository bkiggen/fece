import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const year = await prisma.year.findUnique({
      where: { id: parseInt(id) },
      include: {
        songs: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!year) {
      return NextResponse.json({ error: "Year not found" }, { status: 404 });
    }

    return NextResponse.json(year);
  } catch (error) {
    console.error("Error fetching year:", error);
    return NextResponse.json({ error: "Failed to fetch year" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const year = await prisma.year.update({
      where: { id: parseInt(id) },
      data: {
        description: body.description,
      },
    });
    return NextResponse.json(year);
  } catch (error) {
    console.error("Error updating year:", error);
    return NextResponse.json({ error: "Failed to update year" }, { status: 500 });
  }
}
