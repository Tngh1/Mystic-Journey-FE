import { NextResponse } from "next/server";
import { get } from "@/lib/api/client";

export async function GET() {
  try {
    const result = await get("/api/dashboard/stats");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get dashboard stats." },
      { status: 500 },
    );
  }
}
