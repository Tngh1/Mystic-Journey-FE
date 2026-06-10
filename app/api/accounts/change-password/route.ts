import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await post("/api/accounts/change-password", body);
    return NextResponse.json({ message: "Password changed successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to change password." },
      { status: 400 },
    );
  }
}
