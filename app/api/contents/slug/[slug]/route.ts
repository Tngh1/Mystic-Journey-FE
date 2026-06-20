import { NextRequest, NextResponse } from "next/server";
import { get } from "@/lib/api/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const result = await get(`/api/contents/slug/${slug}`);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get content by slug." },
      { status: 500 },
    );
  }
}
