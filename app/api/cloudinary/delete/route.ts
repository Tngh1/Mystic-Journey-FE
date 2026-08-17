import { createHash } from "node:crypto";
import { NextResponse } from "next/server";


// Send a POST request with the supplied payload, unwrap the API envelope, and return the typed response payload.
export async function POST(request: Request) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary server config is missing (need CLOUDINARY_API_SECRET)." },
      { status: 500 }
    );
  }

  let publicId: unknown;
  try {
    ({ publicId } = (await request.json()) as { publicId?: unknown });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof publicId !== "string" || publicId.trim() === "") {
    return NextResponse.json({ error: "publicId is required." }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const body = new FormData();
  body.append("public_id", publicId);
  body.append("timestamp", String(timestamp));
  body.append("api_key", apiKey);
  body.append("signature", signature);

  // Helper function executing response.
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body,
  });

  // Helper function executing data.
  const data = (await response.json()) as { result?: string; error?: { message?: string } };

  if (!response.ok || (data.result !== "ok" && data.result !== "not found")) {
    return NextResponse.json(
      { error: data.error?.message || `Cloudinary destroy failed (${data.result ?? response.status}).` },
      { status: 502 }
    );
  }

  return NextResponse.json({ result: data.result });
}
