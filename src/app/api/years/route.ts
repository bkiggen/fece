import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const years = await prisma.year.findMany({
      include: {
        songs: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { year: "desc" },
    });
    return NextResponse.json(years);
  } catch (error) {
    console.error("Error fetching years:", error);
    return NextResponse.json({ error: "Failed to fetch years" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const year = await prisma.year.create({
      data: {
        year: body.year,
        description: body.description || "",
      },
    });
    return NextResponse.json(year, { status: 201 });
  } catch (error) {
    console.error("Error creating year:", error);
    return NextResponse.json({ error: "Failed to create year" }, { status: 500 });
  }
}
