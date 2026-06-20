import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await post("/api/accounts/send-verification-code", { email: body.email });
    return NextResponse.json({ message: `Verification code sent to ${body.email}.` });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to send verification code." },
      { status: 400 },
    );
  }
}
