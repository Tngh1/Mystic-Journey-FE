import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

/* lib/api/cloudinary.ts đã gọi POST /api/cloudinary/delete từ đầu, nhưng route
   này chưa từng tồn tại => mọi lần thay ảnh đều 404 và ảnh cũ nằm lại trên
   Cloudinary mãi mãi. Việc xoá bắt buộc phải chạy ở server: nó cần api_secret
   để ký request, và secret thì không được mang tiền tố NEXT_PUBLIC_ (làm vậy
   là nhúng thẳng secret vào bundle của browser).

   Chữ ký theo đúng spec destroy của Cloudinary: SHA1 của các tham số đã sắp xếp
   nối với api_secret. Dùng node:crypto nên không cần thêm package nào. */

export async function POST(request: Request) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    // Báo rõ thiếu biến nào thay vì im lặng bỏ qua — im lặng chính là lý do
    // bug này sống sót lâu như vậy.
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

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body,
  });

  const data = (await response.json()) as { result?: string; error?: { message?: string } };

  // Cloudinary trả 200 kèm result: "not found" khi ảnh đã bị xoá trước đó —
  // coi đó là thành công, vì đích đến (ảnh không còn) đã đạt.
  if (!response.ok || (data.result !== "ok" && data.result !== "not found")) {
    return NextResponse.json(
      { error: data.error?.message || `Cloudinary destroy failed (${data.result ?? response.status}).` },
      { status: 502 }
    );
  }

  return NextResponse.json({ result: data.result });
}
