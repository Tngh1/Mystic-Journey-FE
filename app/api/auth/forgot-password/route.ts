import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await post("/api/auth/forgot-password", { email: body.email });
    return NextResponse.json({ message: `Reset code sent to ${body.email}.` });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to send reset code." },
      { status: 400 },
    );
  }
}
