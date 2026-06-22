import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await post("/api/auth/reset-password", body);
    return NextResponse.json({ message: "Password reset successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Password reset failed." },
      { status: 400 },
    );
  }
}
