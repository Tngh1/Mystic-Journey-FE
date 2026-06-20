import { NextRequest, NextResponse } from "next/server";
import { del } from "@/lib/api/client";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await del(`/api/contents/blocks/${id}`);
    return NextResponse.json({ message: "Block deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to delete block." },
      { status: 400 },
    );
  }
}
