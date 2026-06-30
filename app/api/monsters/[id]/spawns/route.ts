import { NextRequest, NextResponse } from "next/server";
import { get, post } from "@/lib/api/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await get(`/api/monsters/${id}/spawns`);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get monster spawns." },
      { status: 500 },
    );
  }
}
