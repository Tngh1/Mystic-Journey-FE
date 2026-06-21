import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await post("/api/auth/verify-email", body);
    return NextResponse.json({ message: "Email verified successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Email verification failed." },
      { status: 400 },
    );
  }
}
