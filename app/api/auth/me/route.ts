import { NextRequest, NextResponse } from "next/server";
import { get } from "@/lib/api/client";

export async function GET() {
  try {
    const result = await get("/api/auth/me");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get account info." },
      { status: 401 },
    );
  }
}
