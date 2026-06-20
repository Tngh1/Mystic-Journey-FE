import { NextRequest, NextResponse } from "next/server";
import { get, put } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await get("/api/playerprofiles", Object.fromEntries(searchParams));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get player profiles." },
      { status: 500 },
    );
  }
}
