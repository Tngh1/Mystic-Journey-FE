import { NextRequest, NextResponse } from "next/server";
import { get, put } from "@/lib/api/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await get(`/api/gamesettings/${id}`);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get game setting." },
      { status: 500 },
    );
  }
}
