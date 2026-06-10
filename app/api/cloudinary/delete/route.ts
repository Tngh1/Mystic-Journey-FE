import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function getCloudinaryServerConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary server config.");
  }
  return { cloudName, apiKey, apiSecret };
}

export async function POST(request: NextRequest) {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryServerConfig();

    const body = (await request.json()) as { publicId?: string };
    const publicId = body.publicId?.trim();

    if (!publicId) {
      return NextResponse.json({ error: "publicId is required." }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createHash("sha1")
      .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      body: formData,
    });

    const data = (await response.json()) as {
      result?: string;
      error?: { message?: string };
    };

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "Failed to delete image from Cloudinary." }, { status: response.status });
    }

    if (data.result !== "ok" && data.result !== "not found") {
      return NextResponse.json({ error: "Unexpected Cloudinary delete response." }, { status: 500 });
    }

    return NextResponse.json({ success: true, result: data.result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete image from Cloudinary." },
      { status: 500 }
    );
  }
}
