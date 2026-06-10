import { NextRequest, NextResponse } from "next/server";
import { get, post } from "@/lib/api/client";

export async function GET() {
  try {
    const result = await get("/api/contents/categories");
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get categories." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await post("/api/contents/categories", body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create category." },
      { status: 400 },
    );
  }
}
