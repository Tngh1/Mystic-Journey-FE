import { NextRequest, NextResponse } from "next/server";
import { get } from "@/lib/api/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await get("/api/GachaBanners/items-paged", Object.fromEntries(searchParams));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get gacha banner items." },
      { status: 500 },
    );
  }
}
