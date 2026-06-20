import { NextRequest, NextResponse } from "next/server";
import { del } from "@/lib/api/client";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await del(`/api/mails/${id}`);
    return NextResponse.json({ message: "Mail deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to delete mail." },
      { status: 400 },
    );
  }
}
