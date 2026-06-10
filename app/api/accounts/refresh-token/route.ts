import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await post("/api/accounts/refresh-token", body);
    return NextResponse.json({ message: "Token refreshed successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Token refresh failed." },
      { status: 401 },
    );
  }
}
