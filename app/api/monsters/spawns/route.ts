import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await post("/api/monsters/spawns", body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create monster spawn." },
      { status: 400 },
    );
  }
}
