import { NextRequest, NextResponse } from "next/server";
import { post } from "@/lib/api/client";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await post(`/api/adminaccounts/${id}/ban`, {});
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to ban account." },
      { status: 400 },
    );
  }
}
