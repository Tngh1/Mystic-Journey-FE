import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await post("/api/auth/login", body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login failed." },
      { status: 401 },
    );
  }
}
