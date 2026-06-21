import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST() {
  try {
    await post("/api/auth/refresh-token");
    return NextResponse.json({ message: "Token refreshed successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Token refresh failed." },
      { status: 401 },
    );
  }
}
