import { NextRequest, NextResponse } from "next/server";
import { get } from "@/lib/api/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ playerProfileId: string }> },
) {
  try {
    const { playerProfileId } = await params;
    const result = await get(`/api/mails/player/${playerProfileId}`);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to get player mails." },
      { status: 500 },
    );
  }
}
